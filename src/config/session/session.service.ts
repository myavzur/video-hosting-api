import { Logger } from "@nestjs/common";

import { Channel } from "@/shared/entities";
import { ChannelSession } from "@/shared/interfaces";

export class SessionService {
	logger: Logger = new Logger(SessionService.name);

	async saveSession(session: ChannelSession, channel: Channel): Promise<void> {
		session.channel = {
			id: channel.id
		};

		this.logger.debug(`saved channel ${channel.id}`);
	}

	async deleteSession(session: ChannelSession): Promise<void> {
		if (session?.channel) {
			await session.destroy(() =>
				this.logger.debug(`delete ${session.channel.id} from cache.`)
			);
			return;
		}

		this.logger.debug("no channel in session.");
	}
}
