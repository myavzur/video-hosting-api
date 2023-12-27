import {
	Body,
	Controller,
	Post,
	Session,
	UseGuards,
	ValidationPipe
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ChannelSession } from "@/shared/interfaces";

import { AuthGuard } from "../auth/guards";

import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto";

@ApiTags("Video Comments")
@Controller("comments")
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Post()
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Добавить комментарий к видео." })
	async createComment(
		@Session() session: ChannelSession,
		@Body(new ValidationPipe()) dto: CreateCommentDto
	) {
		return await this.commentsService.createComment(session.channel.id, dto);
	}
}
