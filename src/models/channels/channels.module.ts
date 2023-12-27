import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VideosModule } from "@/models/videos";

import { Channel, Subscription } from "../../shared/entities";

import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";

@Module({
	imports: [TypeOrmModule.forFeature([Channel, Subscription]), VideosModule],
	controllers: [ChannelsController],
	providers: [ChannelsService],
	exports: [ChannelsService]
})
export class ChannelsModule {}
