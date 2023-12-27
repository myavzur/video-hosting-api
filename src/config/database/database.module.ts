import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import {
	Channel,
	RecoveryTicket,
	Subscription,
	Video,
	VideoComment,
	VideoLike
} from "@/shared/entities";

// Current Working Direction (node process) = budget-up/server
const CWD = process.cwd();

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				url: configService.get("POSTGRES_URI"),
				entities: [
					Channel,
					Subscription,
					RecoveryTicket,
					Video,
					VideoLike,
					VideoComment
				],
				/*
					Using {synchronize: true} in production will cause losing data.
					For production use migrations instead. (`npm run migration:generate -- apps/auth/database/migrations/InitDatabase`, `npm run migration:run`, etc...)
				*/
				synchronize: true
			})
		})
	]
})
export class DatabaseModule {}
