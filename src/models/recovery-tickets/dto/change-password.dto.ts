import { IsString, MaxLength, MinLength } from "class-validator";

import { ChannelEntityLimits } from "@/shared/constants/database.constants";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDto {
	@ApiProperty()
	@IsString()
	@MinLength(12, { message: 'Password cant"t be less than 12 symbols.' })
	@MaxLength(ChannelEntityLimits.PASSWORD_LEN, {
		message: `Password can't be larger than ${ChannelEntityLimits.PASSWORD_LEN} symbols.`
	})
	password: string;

	@ApiProperty()
	@IsString()
	passwordConfirmation: string;
}
