import type { getAnnouncement } from './db/announcement/getAnnouncement';
import type { getChannel } from './db/channel/getChannel';

export type GetChannelResult = Exclude<Awaited<ReturnType<typeof getChannel>>, undefined>;
export type GetAnnouncementResult = Exclude<Awaited<ReturnType<typeof getAnnouncement>>, undefined>;
