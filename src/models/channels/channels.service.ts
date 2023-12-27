import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { Channel, Subscription } from "@/shared/entities";

import { RegisterDto } from "@/models/auth/dto";
import { VideosService } from "@/models/videos";

import { UpdateChannelDto } from "./dto";
import { SubscriptionResult } from "./interfaces";

@Injectable()
export class ChannelsService {
	constructor(
		@InjectRepository(Channel)
		private readonly channelsRepository: Repository<Channel>,
		@InjectRepository(Subscription)
		private readonly subscriptionsRepository: Repository<Subscription>,
		private readonly videosService: VideosService
	) {}

	async createChannel(dto: RegisterDto) {
		const $password = await bcrypt.hash(dto.password, 5);

		const newChannel = await this.channelsRepository.create();

		newChannel.email = dto.email;
		newChannel.name = dto.name;
		newChannel.password = $password;

		return await this.channelsRepository.save(newChannel);
	}

	/** ONLY AUTHORIZED USER could update ONLY HIS channel. */
	async updateChannel(id: Channel["id"], dto: UpdateChannelDto) {
		const channel = await this.findById(id);
		if (!channel) throw new NotFoundException("Channel does not exist");

		channel.name = dto.name;
		channel.description = dto.description;
		channel.avatar_url = dto.avatar_url;

		return await this.channelsRepository.save(channel);
	}

	/** Updates channel's password by email. */
	async updatePassword(email: Channel["email"], newPassword: string) {
		const channel = await this.findByEmail(email);
		if (!channel) throw new NotFoundException("Channel does not exist");

		const $password = await bcrypt.hash(newPassword, 5);

		channel.password = $password;

		return await this.channelsRepository.save(channel);
	}

	/** Subscribe or unsubscribe to channel */
	async subscribe(from_channelId: Channel["id"], to_channelId: Channel["id"]) {
		if (from_channelId === to_channelId) {
			throw new BadRequestException();
		}

		const params = {
			from_channel: { id: from_channelId },
			to_channel: { id: to_channelId }
		};

		const channelToSubscribe = await this.findById(to_channelId);
		if (!channelToSubscribe)
			throw new NotFoundException("Provided channel to subscribe does not exist");

		const isSubscribed = await this.subscriptionsRepository.findOneBy(params);

		if (!isSubscribed) {
			channelToSubscribe.subscribers_value++;
			await this.channelsRepository.save(channelToSubscribe);
			await this.subscriptionsRepository.save(params);
			return { result: SubscriptionResult.SUBSCRIBED };
		}

		channelToSubscribe.subscribers_value--;
		await this.channelsRepository.save(channelToSubscribe);
		await this.subscriptionsRepository.delete(params);
		return { result: SubscriptionResult.UNSUBSCRIBED };
	}

	/**
	 * isStudio params determines whether the channel is received via the path GET(/api/channels/id/:channelId)
	 * or GET(/api/channels/me)
	 */
	async findById(id: Channel["id"], isStudio?: boolean): Promise<Channel> {
		const channel = await this.channelsRepository.findOne({
			where: { id },
			relations: {
				subscriptions: { to_channel: true },
				subscribers: { from_channel: true }
			},
			order: { created_at: "DESC" }
		});

		const videos = await this.videosService.findByChannelId(channel.id, isStudio);

		return { ...channel, videos };
	}

	async findByEmail(email: Channel["email"]) {
		return await this.channelsRepository.findOneBy({ email });
	}

	// Юзается для регистрации (Name и Email уникальны для каждого)
	async findByEmailOrName(email: Channel["email"], name: Channel["name"]) {
		console.log(email, name);
		const channel = await this.channelsRepository.findOneBy([{ email }, { name }]);
		console.log(channel);
		return channel;
	}

	async findByEmailWithPassword(email: Channel["email"]) {
		return await this.channelsRepository.findOne({
			where: { email },
			relations: {
				videos: true,
				subscriptions: { to_channel: true },
				subscribers: { from_channel: true }
			},
			select: {
				id: true,
				email: true,
				password: true,
				created_at: true,
				updated_at: true,
				name: true,
				description: true,
				avatar_url: true,
				is_verified: true,
				subscribers_value: true
			}
		});
	}

	async findAll() {
		return await this.channelsRepository.find({
			relations: {
				subscriptions: { to_channel: true },
				subscribers: { from_channel: true }
			}
		});
	}
}
