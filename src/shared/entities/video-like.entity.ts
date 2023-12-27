import { Entity, JoinColumn, ManyToOne } from "typeorm";

import { Base } from "./base.entity";
import { Channel } from "./channel.entity";
import { Video } from "./video.entity";

@Entity({ name: "videos_has_likes" })
export class VideoLike extends Base {
	@ManyToOne(() => Video, video => video.likes)
	@JoinColumn({ name: "videoId", referencedColumnName: "id" })
	video: Video;

	@ManyToOne(() => Channel, channel => channel.likes)
	@JoinColumn({ name: "channelId", referencedColumnName: "id" })
	channel: Channel;
}
