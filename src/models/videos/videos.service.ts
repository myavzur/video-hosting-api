import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, ILike, MoreThan, Repository } from "typeorm";

import { Channel, Video, VideoLike } from "@/shared/entities";
import { OkException } from "@/shared/exceptions";

import { MediaService } from "@/models/media";

import { CreateDraftVideoDto, UpdateVideoDto } from "./dto";
import { LikeResult, VideoPrivacy } from "./interfaces";

@Injectable()
export class VideosService {
	constructor(
		@InjectRepository(Video)
		private readonly videosRepository: Repository<Video>,
		@InjectRepository(VideoLike)
		private readonly likesRepository: Repository<VideoLike>,
		private readonly mediaService: MediaService
	) {}

	/** Create draft video.
	 * - Saves video on disk.
	 * - Saves video in database (as "private").
	 */
	async createDraftVideo(channelId: Channel["id"], dto: CreateDraftVideoDto) {
		// TODO: File check
		const newVideo = await this.videosRepository.save({
			channel: { id: channelId },
			privacy: VideoPrivacy.PRIVATE,
			name: dto.file_name.split(".")[0],
			file_name: dto.file_name
		});

		return newVideo;
	}

	/** Save video file on disk. Also update draft video video_url. */
	async uploadVideo(
		channelId: Channel["id"],
		file: Express.Multer.File,
		videoId: Video["id"]
	) {
		if (!file.mimetype.startsWith("video/")) {
			throw new BadRequestException("Only video files are available.");
		}

		const video = await this.findById(videoId);

		if (video.channel.id !== channelId) {
			throw new ForbiddenException(
				"You don't have permission to modify this video."
			);
		}

		if (video.file_url) {
			throw new BadRequestException("Video already has content.");
		}

		const outputFile = await this.mediaService.saveFile(file, "v");

		return await this.videosRepository.save({
			...video,
			file_url: outputFile.path,
			file_name: outputFile.originalName,
			file_type: outputFile.mimeType,
			duration: outputFile.duration
		});
	}

	async uploadThumbnail(
		channelId: Channel["id"],
		file: Express.Multer.File,
		videoId: Video["id"]
	) {
		if (!file.mimetype.startsWith("image/")) {
			throw new BadRequestException("Only image files are available.");
		}

		const video = await this.findById(videoId);

		if (video.channel.id !== channelId) {
			throw new ForbiddenException(
				"You don't have permission to modify this video."
			);
		}

		const outputFile = await this.mediaService.saveFile(file, "v-t");

		return await this.videosRepository.save({
			...video,
			poster_url: outputFile.path
		});
	}

	async updateVideo(
		channelId: Channel["id"],
		videoId: Video["id"],
		dto: UpdateVideoDto
	) {
		const video = await this.findById(videoId);

		if (video.channel.id !== channelId) {
			throw new ForbiddenException(
				"You don't have permission to modify this video."
			);
		}

		if (!video.file_url) {
			throw new BadRequestException(
				"Firstly you need to upload content for this video. POST /api/videos/upload"
			);
		}

		return await this.videosRepository.save({ ...video, ...dto });
	}

	async updateViews(id: Video["id"]) {
		const video = await this.findById(id);

		video.views++;
		await this.videosRepository.save(video);

		throw new OkException(`Views on video "${video.name}" was incremented by 1`);
	}

	async findLiked(channelId: Channel["id"]) {
		const videosLiked = await this.likesRepository.find({
			where: {
				channel: { id: channelId }
			},
			relations: {
				video: { channel: true }
			},
			order: { created_at: "DESC" }
		});

		return videosLiked;
	}

	async updateLikes(channelId: Channel["id"], videoId: Video["id"]) {
		const params = {
			channel: { id: channelId },
			video: { id: videoId }
		};

		const videoToLike = await this.findById(videoId);
		const isLiked = await this.likesRepository.findOneBy(params);

		if (!isLiked) {
			videoToLike.likes_value++;
			await this.videosRepository.save(videoToLike);
			await this.likesRepository.save(params);
			return { result: LikeResult.LIKED };
		}

		videoToLike.likes_value--;
		await this.videosRepository.save(videoToLike);
		await this.likesRepository.delete(params);
		return { result: LikeResult.UNLIKED };
	}

	async deleteVideo(channelId: Channel["id"], videoId: Video["id"]) {
		const video = await this.findById(videoId);

		if (video.channel.id !== channelId) {
			throw new ForbiddenException(
				"You don't have permission to delete this video."
			);
		}

		return await this.videosRepository.delete({ id: videoId });
	}

	// ! Utils
	/** Get all videos. (only with public privacy). */
	async findAll(term?: string) {
		let findOptions: FindManyOptions<Video> = {
			where: { privacy: VideoPrivacy.PUBLIC },
			relations: {
				channel: true,
				comments: {
					channel: true
				}
			}
		};

		if (term) {
			findOptions = {
				...findOptions,
				where: {
					...findOptions.where,
					name: ILike(`%${term}%`)
				},
				order: { name: "ASC" }
			};
		} else {
			findOptions = {
				...findOptions,
				order: { created_at: "DESC" }
			};
		}

		return await this.videosRepository.find(findOptions);
	}

	/** Find most popular videos by views. (only with public privacy) */
	async findMostPopular() {
		return await this.videosRepository.find({
			where: {
				views: MoreThan(10),
				privacy: VideoPrivacy.PUBLIC
			},
			order: {
				views: {
					direction: "DESC"
				}
			},
			relations: {
				channel: true, // Author of the video
				comments: {
					channel: true // Author of the comment
				}
			}
		});
	}

	/** By calling this method you must be sure there is channel with passed {channelId}!
	 * isStudio param determines whether the channel is received via the path GET(/api/channels/id/:channelId)
	 * or GET(/api/channels/me)
	 */
	async findByChannelId(channelId: Channel["id"], isStudio?: boolean) {
		const findOptions: FindManyOptions<Video> = {
			where: {
				channel: { id: channelId }
			},
			relations: { channel: true },
			order: { created_at: "DESC" }
		};

		if (!isStudio) {
			findOptions.where = {
				...findOptions.where,
				privacy: VideoPrivacy.PUBLIC
			};
		}

		const videos = await this.videosRepository.find(findOptions);

		return videos;
	}

	/** Throws new NotFoundException if user doesn't exist by itself
	 * * Returns {video} with {isLiked} by {channelId} if {channelId} is passed.
	 * * Overwise - returns {video} without {isLiked} field
	 */
	async findById(videoId: Video["id"], channelId?: Channel["id"]) {
		const video = await this.videosRepository.findOne({
			where: { id: videoId },
			relations: {
				channel: true, // Author of the video
				comments: {
					channel: true // Author of the comment
				}
			}
		});

		if (!video) throw new NotFoundException("Video doesn't exist.");
		if (
			video.privacy === VideoPrivacy.PRIVATE &&
			channelId &&
			video.channel.id !== channelId
		) {
			// This is need to confuse user if he just typing random id's to check if there are private videos.
			throw new NotFoundException("Video doesn't exist.");
		}

		// * Returns video with {isLiked} by {channelId} if {channelId} is passed.
		// * Overwise - returns {video} without {isLiked} field
		if (channelId) {
			const like = await this.likesRepository.findOne({
				where: {
					channel: {
						id: channelId
					},
					video: {
						id: videoId
					}
				}
			});

			return {
				...video,
				is_liked: Boolean(like)
			};
		}

		return video;
	}
}
