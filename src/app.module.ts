import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";

import { DatabaseModule } from "@/config/database";
import { SessionsModule } from "@/config/session";

import { AuthModule } from "@/models/auth";
import { ChannelsModule } from "@/models/channels";
import { CommentsModule } from "@/models/comments";
import { MediaModule } from "@/models/media";
import { RecoveryTicketsModule } from "@/models/recovery-tickets";
import { VideosModule } from "@/models/videos";

// Current Working Direction (node process) = VideosHub/server
const CWD = process.cwd();

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: path.join(CWD, ".env")
		}),

		// For GET request to static files: pages, images, etc...
		ServeStaticModule.forRoot({ rootPath: path.join(CWD, "public") }),

		DatabaseModule,
		SessionsModule,
		AuthModule,
		ChannelsModule,
		RecoveryTicketsModule,
		MediaModule,
		VideosModule,
		CommentsModule
	]
})
export class AppModule {}
