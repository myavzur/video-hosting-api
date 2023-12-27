import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Video, VideoLike } from "@/shared/entities";

import { MediaModule } from "../media";

import { VideosController } from "./videos.controller";
import { VideosService } from "./videos.service";

@Module({
	imports: [TypeOrmModule.forFeature([Video, VideoLike]), MediaModule],
	controllers: [VideosController],
	providers: [VideosService],
	exports: [VideosService]
})
export class VideosModule {}
