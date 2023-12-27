import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

import { ChannelEntityLimits } from "@/shared/constants/database.constants";

export class UpdateChannelDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	@MaxLength(ChannelEntityLimits.NAME_LEN, {
		message: `Name can"t be > ${ChannelEntityLimits.NAME_LEN} symbols!`
	})
	name?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	avatar_url?: string;
}
