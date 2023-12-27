import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const isAuthorized = Boolean(request?.session?.channel?.id);

		if (!isAuthorized) {
			throw new UnauthorizedException("401 Unauthorized");
		}

		return true;
	}
}
