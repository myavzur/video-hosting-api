import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import { LessThan, Repository } from "typeorm";

import { sendMailRecovery } from "@/config/mail";

import { CookieKeys } from "@/shared/constants/cookie.constants";
import { RecoveryTicket } from "@/shared/entities";
import { CreatedException, OkException } from "@/shared/exceptions";

import { ChannelsService } from "../channels";

import { CreateTicketDto, UpdatePasswordDto } from "./dto";

const FIVE_MINUTES = 2 * 60 * 1000;

@Injectable()
export class RecoveryTicketsService {
	constructor(
		@InjectRepository(RecoveryTicket)
		private readonly recoveryTicketsRepository: Repository<RecoveryTicket>,
		private readonly channelsService: ChannelsService
	) {}

	logger: Logger = new Logger(RecoveryTicket.name);

	/**
	 * ? Creates ticket for password recovery and sends link to email.
	 * * Also sets cookies for further identification.
	 */
	async createTicket(res: Response, dto: CreateTicketDto) {
		const channel = await this.channelsService.findByEmail(dto.email);
		if (!channel) throw new NotFoundException("Channel does not exist");

		const $hash = await bcrypt.hash(Date.now().toString(), 5);
		const $hashModified = $hash.replace(/[^\w\d]/gm, ""); // ? Remove Symbols from hash for correct routing at frontend

		// * Send mail with link to recovery page
		try {
			await sendMailRecovery(
				dto.email,
				`http://localhost:3000/recovery/${$hashModified}`
			);
		} catch (e) {
			if (e.responseCode === 550) {
				throw new BadRequestException(
					`Mailbox unavailable (mailbox not found, no access).`
				);
			}

			this.logger.error(e);
			throw new InternalServerErrorException(`Unhandled error on creating ticket.`);
		}

		await this.recoveryTicketsRepository.save({
			email: channel.email,
			expires_at: Date.now() + FIVE_MINUTES,
			hash: $hashModified
		});

		res.cookie(CookieKeys.RECOVERY_HASH, $hashModified);

		throw new CreatedException("Ticket created");
	}

	/** Checks whether the ticket is up-to-date or not (expired or does not exist). */
	async verifyTicket(req: Request) {
		this.verifyHash(req);

		const ticket = await this.findByHash(req.cookies[CookieKeys.RECOVERY_HASH]);
		const isExpired = ticket?.expires_at - Date.now() <= 0;

		if (!ticket || isExpired) {
			throw new BadRequestException("Ticket does't exist or expired.");
		}

		return { recoveryForEmail: ticket.email };
	}

	async updatePassword(req: Request, res: Response, dto: UpdatePasswordDto) {
		this.verifyHash(req);

		const ticket = await this.findByHash(req.cookies[CookieKeys.RECOVERY_HASH]);

		if (!ticket) {
			throw new BadRequestException("Ticket not found.");
		}

		await this.channelsService.updatePassword(ticket.email, dto.password);
		await this.recoveryTicketsRepository.delete({ id: ticket.id });

		res.clearCookie(CookieKeys.RECOVERY_HASH);

		throw new OkException("Password has been changed.");
	}

	// ! FindBy, DeleteBy, little helpers...
	async clearExpiredTickets() {
		await this.recoveryTicketsRepository.delete({
			expires_at: LessThan(Date.now())
		});
	}

	async findByHash(hash: string) {
		const ticket = await this.recoveryTicketsRepository.findOne({ where: { hash } });
		return ticket;
	}

	/** Prevents other people from changing your password if you accidentally send them a link. */
	private verifyHash(req: Request) {
		if (!req?.cookies[CookieKeys.RECOVERY_HASH]) {
			throw new ForbiddenException("Forbidden");
		}
	}
}
