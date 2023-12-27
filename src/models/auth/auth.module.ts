import { Module } from "@nestjs/common";

import { SessionsModule } from "@/config/session";

import { ChannelsModule } from "@/models/channels";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [SessionsModule, ChannelsModule],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
