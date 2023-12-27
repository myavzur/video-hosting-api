import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";

import { ChannelEntityLimits } from "../constants/database.constants";

import { Subscription } from "./subscription.entity";
import { VideoLike } from "./video-like.entity";
import { Video } from "./video.entity";

@Entity({ name: "channels" })
export class Channel {
	@PrimaryGeneratedColumn("uuid")
	readonly id: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@Column("varchar", { unique: true, length: ChannelEntityLimits.NAME_LEN })
	name: string;

	@Column("varchar", { unique: true, length: ChannelEntityLimits.EMAIL_LEN })
	email: string;

	@Column("varchar", { select: false, length: 255 })
	password: string;

	@Column("varchar", { length: 255, nullable: true })
	avatar_url?: string;

	@Column("text", { default: "" })
	description: string;

	@Column("boolean", { default: false })
	is_verified: boolean;

	@Column("int", { default: 0 })
	subscribers_value?: number;

	// * Relations
	@OneToMany(() => VideoLike, likes => likes.channel)
	likes: VideoLike[];

	@OneToMany(() => Video, video => video.channel)
	@JoinColumn({ name: "id", referencedColumnName: "channelId" })
	videos: Video[];

	@OneToMany(() => Subscription, subscription => subscription.from_channel)
	@JoinColumn({ name: "id", referencedColumnName: "to_channel_id" })
	subscriptions: Subscription[];

	@OneToMany(() => Subscription, subscription => subscription.to_channel)
	@JoinColumn({ name: "id", referencedColumnName: "from_channel_id" })
	subscribers: Subscription[];
}
