import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
	Session,
	UploadedFile,
	UseGuards,
	UseInterceptors,
	ValidationPipe
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger/dist";

import { Video } from "@/shared/entities";
import { ChannelSession } from "@/shared/interfaces";

import { AuthGuard } from "@/models/auth/guards";

import { CreateDraftVideoDto, UpdateVideoDto } from "./dto";
import { VideosService } from "./videos.service";

@ApiTags("Videos")
@Controller("videos")
export class VideosController {
	constructor(private readonly videosService: VideosService) {}

	@Get()
	@ApiOperation({ summary: "Получить все видео. (Публичные)" })
	async findAll() {
		return await this.videosService.findAll();
	}

	// Search video by some term (?term=34kf;]d;kfje)
	@Get("search")
	@ApiOperation({ summary: "Получить все видео по запрашиваемому названию." })
	async searchByTerm(@Query("term") term?: string) {
		return await this.videosService.findAll(term);
	}

	// Get most popular by views
	@Get("most-popular")
	@ApiOperation({ summary: "Получить самые популярные видео. (По просмотрам)" })
	async findMostPopular() {
		return await this.videosService.findMostPopular();
	}

	@Get("liked")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Получить видео на которые вы поставили лайк. " })
	async findLikedVideos(@Session() session: ChannelSession) {
		return await this.videosService.findLiked(session.channel.id);
	}

	// Get video by id
	@Get("id/:videoId")
	@ApiOperation({ summary: "Получить определенное видео по ID." })
	async findById(
		@Session() session: ChannelSession,
		@Param("videoId") videoId: Video["id"]
	) {
		// ! Don't use AuthGuard. AuthGuard won't work with SSG from Next
		if (session?.channel?.id) {
			return await this.videosService.findById(videoId, session.channel.id);
		}

		return await this.videosService.findById(videoId);
	}

	// * Create draft video
	@Post()
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Создает черновое видео с указанием создателя. (Draft)" })
	async createDraftVideo(
		@Session() session: ChannelSession,
		@Body(new ValidationPipe()) dto: CreateDraftVideoDto
	) {
		return await this.videosService.createDraftVideo(session.channel.id, dto);
	}

	@Post("upload")
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor("video"))
	@ApiOperation({
		summary:
			"Загружает видео файл для определенного видео в database и обновляет его videoPath"
	})
	async uploadVideo(
		@Session() session: ChannelSession,
		@UploadedFile() file: Express.Multer.File,
		@Body("videoId") videoId: Video["id"]
	) {
		return await this.videosService.uploadVideo(session.channel.id, file, videoId);
	}

	@Post("upload-thumbnail")
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor("thumbnail"))
	@ApiOperation({
		summary:
			"Загружает превью (thumbnail) для определенного видео в database и обновляет его thumbnailPath"
	})
	async uploadThumbnail(
		@Session() session: ChannelSession,
		@UploadedFile() file: Express.Multer.File,
		@Body("videoId") videoId: Video["id"]
	) {
		return await this.videosService.uploadThumbnail(
			session.channel.id,
			file,
			videoId
		);
	}

	// Update video with data
	@Patch("id/:videoId")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Обновить определнное видео по ID. (Только свои)" })
	async updateVideo(
		@Session() session: ChannelSession,
		@Param("videoId") videoId: Video["id"],
		@Body(new ValidationPipe()) dto: UpdateVideoDto
	) {
		if (!dto.description && !dto.name && !dto.privacy && !dto.thumbnailPath) {
			throw new BadRequestException("Nothing changing.");
		}

		return await this.videosService.updateVideo(session.channel.id, videoId, dto);
	}

	// No need to authorize, everybody able to update views by watching 10 seconds of video
	@Put("views/:videoId")
	@ApiOperation({ summary: "Инкрементирует просмотры у видео. (Публичные)" })
	async updateViews(@Param("videoId") videoId: Video["id"]) {
		return await this.videosService.updateViews(videoId);
	}

	@Put("likes/:videoId")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Поставить или убрать лайк." })
	async updateLikes(
		@Session() session: ChannelSession,
		@Param("videoId") videoId: Video["id"]
	) {
		return await this.videosService.updateLikes(session.channel.id, videoId);
	}

	@Delete("id/:videoId")
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: "Удалить видео по ID. (Только свои)" })
	async deleteVideo(
		@Session() session: ChannelSession,
		@Param("videoId") videoId: Video["id"]
	) {
		return await this.videosService.deleteVideo(session.channel.id, videoId);
	}
}
