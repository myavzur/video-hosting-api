import { IsNumber, IsString } from "class-validator";

import { Video } from "@/shared/entities";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
	@ApiProperty()
	@IsString()
	content: string;

	@ApiProperty({
		type: "number"
	})
	@IsNumber()
	videoId: Video["id"];
}
