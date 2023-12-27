import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToMany,
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
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
	
	@Column("varchar", { unique: true, length: ChannelEntityLimits.NAME_LEN })
	name: string;

	@Column("varchar", { unique: true, length: ChannelEntityLimits.EMAIL_LEN })
	email: string;

	@Column("varchar", { select: false, length: 255 })
	password: string;

	@Column("varchar", { length: 255, nullable: true })
	avatarPath?: string;

	@Column("text", { default: "" })
	description: string;

	@Column("boolean", { default: false })
	isVerified: boolean;

	@Column("int", { default: 0 })
	subscribersValue?: number;

	// * Relations
	@OneToMany(() => VideoLike, likes => likes.channel)
	likes: VideoLike[];

	@OneToMany(() => Video, video => video.channel)
	@JoinColumn({ name: "id", referencedColumnName: "channelId" })
	videos: Video[];

	@OneToMany(() => Subscription, subscription => subscription.fromChannel)
	@JoinColumn({ name: "id", referencedColumnName: "to_channel_id" })
	subscriptions: Subscription[];

	@OneToMany(() => Subscription, subscription => subscription.toChannel)
	@JoinColumn({ name: "id", referencedColumnName: "from_channel_id" })
	subscribers: Subscription[];
}
