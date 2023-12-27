import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";

import { SessionsModule } from "@/config/session";

import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// CORS
	app.enableCors({
		origin: process.env.APP_CORS_WHITELIST.split(", "),
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
		credentials: true
	});

	// Cookies
	app.use(cookieParser());

	// Sessions
	app.get(SessionsModule).initialize(app);

	// API
	app.setGlobalPrefix("api");
	const swaggerOptions = new DocumentBuilder()
		.setTitle("VideosHub API Docs")
		.setVersion("3.3.0")
		.build();
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
	SwaggerModule.setup("docs", app, swaggerDocument, {
		customfavIcon: `http://localhost:${process.env.APP_PORT}/favicon.ico`,
		customSiteTitle: "Swagger UI - VideosHub"
	});

	// Started
	await app.listen(process.env.APP_PORT, () => {
		const logger = new Logger("Bootstrap");
		logger.verbose(
			"🚀 Application is running on: http://localhost:" + process.env.APP_PORT
		);
	});
}
bootstrap();
