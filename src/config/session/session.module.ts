import { INestApplication, Module } from "@nestjs/common";
import RedisStore from "connect-redis";
import * as session from "express-session";
import { createClient } from "redis";
import { CookieKeys } from "src/shared/constants/cookie.constants";

import { SessionService } from "./session.service";

// Connect to redis.
const redisClient = createClient({ url: process.env.REDIS_URI });
redisClient.connect();

@Module({
	providers: [SessionService],
	exports: [SessionService]
})
export class SessionsModule {
	public async initialize(app: INestApplication) {
		app.use(
			session({
				name: CookieKeys.SESSION_ID,
				secret: process.env.APP_SESSION_SECRET,
				resave: false, // Don't save if session wasn't changed.
				saveUninitialized: false, // Don't save in cache sessions without data.
				rolling: true, // TODO: Refresh Session.
				cookie: {
					maxAge: 24 * 60 * 60 * 1000 // 1 day
				},
				store: new RedisStore({
					client: redisClient,
					prefix: "sess:"
				})
			})
		);
	}
}
