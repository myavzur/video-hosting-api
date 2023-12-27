import { HttpException, HttpStatus } from "@nestjs/common";

export class CreatedException extends HttpException {
	constructor(response?: string) {
		super(`${response || "CREATED"}`, HttpStatus.CREATED);
	}
}
