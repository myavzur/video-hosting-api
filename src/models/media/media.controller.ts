import {
	Controller,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "../auth/guards";

import { UploadFolders } from "./interfaces";
import { MediaService } from "./media.service";

@ApiTags("Media Files")
@Controller("media")
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@Post()
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor("file"))
	@ApiOperation({ summary: "Загружает {файл} на сервер." })
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query("folder") folder?: UploadFolders
	) {
		return await this.mediaService.saveFile(file, folder);
	}
}
