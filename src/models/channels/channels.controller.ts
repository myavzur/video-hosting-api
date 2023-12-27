import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Put,
	Session,
	UseGuards,
	ValidationPipe
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { Channel } from "@/shared/entities";
import { ChannelSession } from "@/shared/interfaces";

import { AuthGuard } from "@/models/auth/guards";

import { ChannelsService } from "./channels.service";
import { UpdateChannelDto } from "./dto";

@ApiTags("Channels")
@Controller("channels")
export class ChannelsController {
	constructor(private readonly channelsService: ChannelsService) {}

	@Get()
	@ApiOperation({
		summary: "Получить всех пользователей."
	})
	async getAll() {
		return await this.channelsService.findAll();
	}

	@Get("id/:channelId")
	@ApiOperation({ summary: "Получить публичную информацию о чьем-либо канале." })
	async getById(@Param("channelId") id: Channel["id"]) {
		return this.channelsService.findById(id);
	}

	@Patch("subscribe/:channelId")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Подписаться на пользователя по ID." })
	async subscribe(
		@Session() session: ChannelSession,
		@Param("channelId") channelId: Channel["id"]
	) {
		return this.channelsService.subscribe(session.channel.id, channelId);
	}
}
