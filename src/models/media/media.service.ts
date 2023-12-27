import { BadRequestException, Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import * as ffprobe from "ffprobe";
import * as ffprobeStatic from "ffprobe-static";
import * as fs from "fs";
import * as path from "path";
import { Readable } from "stream";

import { SaveFileResponse, UploadFolders } from "./interfaces";

// Current Working Direction (node process) = chat/server
const CWD = process.cwd();

@Injectable()
export class MediaService {
	async saveFile(
		file: Express.Multer.File,
		outputFolder: UploadFolders = "d"
	): Promise<SaveFileResponse> {
		if (!file.mimetype.startsWith("image/") && !file.mimetype.startsWith("video/")) {
			throw new BadRequestException(
				"Invalid file type. Only images and videos are available."
			);
		}

		const outputName = await this.generateFileName(file);
		const outputDir = path.join(CWD, "public", "uploads", outputFolder);
		const outputFile = path.join(outputDir, outputName);

		await this.ensureDir(outputDir);
		await this.writeFile(outputFile, file.buffer);

		const duration =
			file.mimetype.startsWith("video/") && (await this.getFileDuration(outputFile));

		return {
			originalName: Buffer.from(file.originalname, "latin1").toString("utf8"),
			mimeType: file.mimetype,
			duration: duration,
			outputName: outputName,
			path: `/uploads/${outputFolder}/${outputName}`
		};
	}

	/** Gets file duration and returns it in seconds. */
	private async getFileDuration(path: string) {
		const metadata = await ffprobe(path, { path: ffprobeStatic.path });

		const videoStream = metadata.streams.find(
			stream => stream.codec_type === "video"
		);

		return videoStream.duration;
	}

	/** Generate file name. */
	private async generateFileName(file: Express.Multer.File): Promise<string> {
		return new Promise((resolve, reject) => {
			const timestamp = new Date().getTime();
			const randomString = crypto.randomBytes(8).toString("hex");

			resolve(`${timestamp}-${randomString}` + path.extname(file.originalname));
		});
	}

	/** Write file on disk by specified directory. */
	private async writeFile(path: string, buffer: Buffer): Promise<void> {
		return new Promise((resolve, reject) => {
			const writeStream = fs.createWriteStream(path);

			writeStream.on("error", reject);
			writeStream.on("finish", resolve);

			const readable = new Readable();
			// Overwrite default _read method;
			readable._read = () => null;
			readable.push(buffer);
			readable.push(null);

			readable.pipe(writeStream);
		});
	}

	/** Create directory if it's not exists. */
	private async ensureDir(path: string) {
		try {
			await fs.promises.access(path);
		} catch (err) {
			if (err.code === "ENOENT") {
				return await fs.promises.mkdir(path, { recursive: true });
			}

			throw err;
		}
	}
}
