import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RecoveryTicket } from "@/shared/entities";
import { formatDate, formatTime } from "@/shared/helpers";

import { ChannelsModule } from "@/models/channels";

import { RecoveryTicketsController } from "./recovery-tickets.controller";
import { RecoveryTicketsService } from "./recovery-tickets.service";

@Module({
	imports: [TypeOrmModule.forFeature([RecoveryTicket]), ChannelsModule],
	controllers: [RecoveryTicketsController],
	providers: [RecoveryTicketsService],
	exports: [RecoveryTicketsService]
})
export class RecoveryTicketsModule implements OnModuleInit {
	constructor(private readonly recoveryTicketsService: RecoveryTicketsService) {}

	logger: Logger = new Logger(RecoveryTicketsModule.name);

	onModuleInit() {
		const ONE_DAY = 24 * 60 * 60 * 1000;

		const date = new Date();
		const nextMidnightDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate() + 1,
			0,
			0,
			0
		);

		const millisecondsUntilMidnight = nextMidnightDate.getTime() - date.getTime();

		// * Clear expired tickets on next midnight, then set an interval to run
		// * the trigger every 24 hours after that
		setTimeout(async () => {
			await this.recoveryTicketsService.clearExpiredTickets();

			setInterval(async () => {
				await this.recoveryTicketsService.clearExpiredTickets();
			}, ONE_DAY);
		}, millisecondsUntilMidnight);

		this.logger.debug(`
      🎴 Expired tickets clearing is planned at: ${formatTime(
				nextMidnightDate
			)} / ${formatDate(nextMidnightDate)} (midnight)
    `);
	}
}
