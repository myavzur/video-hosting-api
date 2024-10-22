import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

import { ChannelEntityLimits } from "@/shared/constants/database.constants";

export class LoginDto {
	@ApiProperty()
	@IsEmail({}, { message: "Email isn't correct..." })
	@MaxLength(ChannelEntityLimits.EMAIL_LEN, {
		message: `Email couldn\"t be larger than ${ChannelEntityLimits.EMAIL_LEN} symbols!`
	})
	email: string;
	@ApiProperty()
	@IsString({ message: "Password must be a string! What a mess... 🤦" })
	@MinLength(12, { message: 'Password cant"t be less than 12 symbols.' })
	@MaxLength(ChannelEntityLimits.PASSWORD_LEN, {
		message: `Password can"t be larger than ${ChannelEntityLimits.PASSWORD_LEN} symbols!`
	})
	password: string;
}
