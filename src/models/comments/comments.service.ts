import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Channel, VideoComment } from "@/shared/entities";

import { CreateCommentDto } from "./dto";

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(VideoComment)
		private readonly commentsRepository: Repository<VideoComment>
	) {}

	/** ? Creates comment to dto.videoId from channelId */
	async createComment(channelId: Channel["id"], dto: CreateCommentDto) {
		const newComment = await this.commentsRepository.save({
			content: dto.content,
			channel: { id: channelId },
			video: { id: dto.videoId }
		});

		return newComment;
	}
}
