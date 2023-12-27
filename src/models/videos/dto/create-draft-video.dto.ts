import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateDraftVideoDto {
	@ApiProperty()
	@IsOptional()
	@IsString()
	originalFileName: string;
}
