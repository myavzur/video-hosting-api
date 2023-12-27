import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { Base } from "./base.entity";
import { Channel } from "./channel.entity";
import { Video } from "./video.entity";

@Entity({ name: "videos_has_comments" })
export class VideoComment extends Base {
	@Column("text")
	content: string;

	// * Relations
	// Author
	@ManyToOne(() => Channel)
	@JoinColumn({ name: "channelId", referencedColumnName: "id" })
	channel: Channel;

	// To video
	@ManyToOne(() => Video, video => video.comments)
	@JoinColumn({ name: "videoId", referencedColumnName: "id" })
	video: Video;
}
