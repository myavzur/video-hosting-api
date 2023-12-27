import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateDraftVideoDto {
	@ApiProperty()
	@IsOptional()
	@IsString()
	file_name: string;
}
