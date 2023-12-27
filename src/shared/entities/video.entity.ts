import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany
} from "typeorm";

import { VideoEntityLimits } from "../constants/database.constants";

import { Base } from "./base.entity";
import { Channel } from "./channel.entity";
import { VideoComment } from "./video-comment.entity";
import { VideoLike } from "./video-like.entity";

@Entity({ name: "videos" })
export class Video extends Base {
	@Column("smallint", {
		default: 0,
		comment: "0 - private, 1 - unlisted, 2 - public"
	})
	privacy: number;

	@Column("varchar", { length: VideoEntityLimits.NAME_LEN })
	name: string;

	@Column("text", { nullable: true })
	description: string;

	@Column("varchar", { nullable: true })
	videoPath: string;

	@Column("varchar")
	originalFileName: string;

	@Column("varchar", { nullable: true })
	thumbnailPath: string;

	@Column("decimal", { nullable: true })
	readonly duration?: number;

	@Column("int", { default: 0 })
	views: number;

	@Column("int", { default: 0 })
	likesValue: number;

	// * Relations
	@OneToMany(() => VideoLike, likes => likes.video)
	likes: VideoLike[];

	@ManyToOne(() => Channel, channel => channel.videos)
	@JoinColumn({ name: "channelId", referencedColumnName: "id" })
	channel: Channel;

	@OneToMany(() => VideoComment, comment => comment.video)
	comments: VideoComment[];
}
