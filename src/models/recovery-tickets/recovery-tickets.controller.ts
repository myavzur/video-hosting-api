import {
	Body,
	Controller,
	Get,
	Patch,
	Post,
	Req,
	Res,
	ValidationPipe
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import { CreateTicketDto, UpdatePasswordDto } from "./dto";
import { RecoveryTicketsService } from "./recovery-tickets.service";

@ApiTags("Recovery")
@Controller("recovery")
export class RecoveryTicketsController {
	constructor(private readonly recoveryTicketsService: RecoveryTicketsService) {}

	@Post("create-ticket")
	@ApiOperation({ summary: "Создать заявку на восстановление пароля." })
	async createTicket(
		@Res({ passthrough: true }) res: Response,
		@Body(new ValidationPipe()) dto: CreateTicketDto
	) {
		return await this.recoveryTicketsService.createTicket(res, dto);
	}

	@Get("verify-ticket")
	@ApiOperation({ summary: "Изменить имейл по хэшу." })
	async verifyTicket(@Req() req: Request) {
		return await this.recoveryTicketsService.verifyTicket(req);
	}

	@Patch("update-password")
	@ApiOperation({ summary: "Поменять пароль." })
	async updatePassword(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body(new ValidationPipe()) dto: UpdatePasswordDto
	) {
		return await this.recoveryTicketsService.updatePassword(req, res, dto);
	}
}

/*
        Client (Next)                                               SERVER (Nest)
  (http://localhost:3000/recovery/:hash)   -> recovery/verify ->       Проверка
*/
