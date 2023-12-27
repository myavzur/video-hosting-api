import { Session } from "express-session";

import { Channel } from "../entities";

export interface ChannelSession extends Session {
	channel?: Pick<Channel, "id">;
}
