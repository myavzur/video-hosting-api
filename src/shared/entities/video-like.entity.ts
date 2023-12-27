import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from "typeorm";

import { Channel } from "./channel.entity";
import { Video } from "./video.entity";

@Entity({ name: "videos_has_likes" })
export class VideoLike {
	@PrimaryGeneratedColumn()
	readonly id: number;

	@CreateDateColumn()
	readonly created_at: Date;

	@ManyToOne(() => Video, video => video.likes)
	@JoinColumn({ name: "videoId", referencedColumnName: "id" })
	video: Video;

	@ManyToOne(() => Channel, channel => channel.likes)
	@JoinColumn({ name: "channelId", referencedColumnName: "id" })
	channel: Channel;
}
