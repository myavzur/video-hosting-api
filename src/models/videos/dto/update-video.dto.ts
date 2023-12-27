import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength
} from "class-validator";

import { VideoEntityLimits } from "@/shared/constants/database.constants";

import { VideoPrivacy } from "../interfaces";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateVideoDto {
	@ApiProperty()
	@IsOptional()
	@IsString()
	@MaxLength(VideoEntityLimits.NAME_LEN, {
		message: `Name can"t be larger than ${VideoEntityLimits.NAME_LEN} symbols.`
	})
	name?: string;

	@ApiProperty()
	@IsOptional()
	@IsNumber()
	privacy?: VideoPrivacy;

	@ApiProperty()
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	thumbnailPath?: string;
}
