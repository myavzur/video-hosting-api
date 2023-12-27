import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	Session,
	UseGuards,
	ValidationPipe
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ChannelSession } from "@/shared/interfaces";

import { UpdateChannelDto } from "@/models/channels/dto";

import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";
import { AuthGuard } from "./guards";

@ApiTags("Authorization")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get("me")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Получить информацию о моём канале." })
	async getMyChannel(@Session() session: ChannelSession) {
		return await this.authService.getMyChannel(session);
	}

	@Put("me")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Обновить информацию о моём канале." })
	async updateMyChannel(
		@Session() session: ChannelSession,
		@Body(new ValidationPipe()) dto: UpdateChannelDto
	) {
		return this.authService.updateMyChannel(session, dto);
	}

	@Post("register")
	@ApiOperation({ summary: "Регистрация." })
	async register(
		@Session() session: ChannelSession,
		@Body(new ValidationPipe()) dto: RegisterDto
	) {
		return this.authService.register(session, dto);
	}

	@Post("login")
	@ApiOperation({ summary: "Логин." })
	async login(
		@Session() session: ChannelSession,
		@Body(new ValidationPipe()) dto: LoginDto
	) {
		return this.authService.login(session, dto);
	}

	@Post("logout")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Выйти из аккаунта." })
	async logout(@Session() session: ChannelSession) {
		return this.authService.logout(session);
	}
}
