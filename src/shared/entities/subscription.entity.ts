import { Entity, JoinColumn, ManyToOne } from "typeorm";

import { Base } from "./base.entity";
import { Channel } from "./channel.entity";

@Entity({ name: "channels_has_subscriptions" })
export class Subscription extends Base {
	// Relations 🎫
	@ManyToOne(() => Channel, channel => channel.subscribers)
	@JoinColumn({ name: "from_channel_id" })
	fromChannel: Channel;

	@ManyToOne(() => Channel, channel => channel.subscriptions)
	@JoinColumn({ name: "to_channel_id" })
	toChannel: Channel;
}
