import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

import { Video } from "@/shared/entities";

export class CreateCommentDto {
	@ApiProperty()
	@IsString()
	content: string;

	@ApiProperty({
		type: "number"
	})
	@IsNumber()
	video_id: Video["id"];
}
