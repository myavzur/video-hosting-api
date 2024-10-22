import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength } from "class-validator";

import { ChannelEntityLimits } from "@/shared/constants/database.constants";

export class CreateTicketDto {
	@ApiProperty()
	@IsEmail({}, { message: "Email isn't valid." })
	@MaxLength(ChannelEntityLimits.EMAIL_LEN, {
		message: `Email couldn't be larger than ${ChannelEntityLimits.EMAIL_LEN} symbols.`
	})
	email: string;
}
