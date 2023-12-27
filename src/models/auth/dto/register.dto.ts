import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

import { ChannelEntityLimits } from "@/shared/constants/database.constants";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
	@ApiProperty()
	@IsEmail({}, { message: "Email isn't valid..." })
	@MaxLength(ChannelEntityLimits.EMAIL_LEN, {
		message: `Email couldn't be larger than ${ChannelEntityLimits.EMAIL_LEN} symbols!`
	})
	email: string;

	@ApiProperty()
	@IsString({ message: "Password must be a string! What a mess... 🤦" })
	@MinLength(12, { message: 'Password cant"t be less than 12 symbols.' })
	@MaxLength(ChannelEntityLimits.PASSWORD_LEN, {
		message: `Password can't be larger than ${ChannelEntityLimits.PASSWORD_LEN} symbols!`
	})
	password: string;

	@ApiProperty()
	@IsString({ message: "Password confirmation must be a string! What a mess... 🤦" })
	passwordConfirmation: string;

	@ApiProperty()
	@IsString({ message: "Name must be a string! Lmao" })
	@MinLength(2, { message: 'Name cant"t be less than 2 symbols.' })
	@MaxLength(ChannelEntityLimits.NAME_LEN, {
		message: `Name can't be larger than ${ChannelEntityLimits.NAME_LEN} symbols!`
	})
	name: string;
}
