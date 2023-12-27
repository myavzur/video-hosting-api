import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { SessionService } from "@/config/session";

import { ChannelSession } from "@/shared/interfaces";

import { UpdateChannelDto } from "@/models/channels/dto";

import { ChannelsService } from "../channels";

import { LoginDto, RegisterDto } from "./dto";

@Injectable()
export class AuthService {
	constructor(
		private readonly channelsService: ChannelsService,
		private readonly sessionService: SessionService
	) {}

	// * Authorization
	async register(session: ChannelSession, dto: RegisterDto) {
		if (dto.password !== dto.password_confirmation) {
			throw new BadRequestException("Passwords didn't match");
		}

		const oldChannel = await this.channelsService.findByEmailOrName(
			dto.email,
			dto.name
		);

		if (oldChannel) {
			throw new BadRequestException("Channel already exists");
		}

		const channel = await this.channelsService.createChannel(dto);

		await this.sessionService.saveSession(session, channel);

		return channel;
	}

	async login(session: ChannelSession, dto: LoginDto) {
		const channel = await this.channelsService.findByEmailWithPassword(dto.email);
		if (!channel) throw new NotFoundException("Channel does not exist");

		const isCorrectPassword = await bcrypt.compare(dto.password, channel.password);

		if (!isCorrectPassword) {
			throw new UnauthorizedException();
		}

		await this.sessionService.saveSession(session, channel);

		delete channel.password; // Doesn't need to return password on client of course!

		return channel;
	}

	async logout(session: ChannelSession) {
		return await this.sessionService.deleteSession(session);
	}

	// * Authorization - Me
	async getMyChannel(session: ChannelSession) {
		const isStudio = true;

		return this.channelsService.findById(session.channel.id, isStudio);
	}

	async updateMyChannel(session: ChannelSession, dto: UpdateChannelDto) {
		return this.channelsService.updateChannel(session.channel.id, dto);
	}
}
