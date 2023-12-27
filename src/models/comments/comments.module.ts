import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VideoComment } from "@/shared/entities";

import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";

@Module({
	imports: [TypeOrmModule.forFeature([VideoComment])],
	controllers: [CommentsController],
	providers: [CommentsService]
})
export class CommentsModule {}
