import { Subscription } from "rxjs";
import { DataSource, DataSourceOptions } from "typeorm";

import {
	Channel,
	RecoveryTicket,
	Video,
	VideoComment,
	VideoLike
} from "@/shared/entities";

export const dataSourceOptions: DataSourceOptions = {
	type: "postgres",
	url: process.env.POSTGRES_URI,
	entities: [Channel, Subscription, RecoveryTicket, Video, VideoLike, VideoComment],
	migrations: ["dist/apps/auth/database/migrations/*.js"]
};

export const dataSource = new DataSource(dataSourceOptions);
