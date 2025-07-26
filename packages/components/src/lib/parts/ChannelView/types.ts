import type { AnnouncementViewProps } from '../AnnouncementView/types';

type Channel = {
  name: string;
  desc: string | undefined;
  icon: string | undefined;
};

type Announcement = AnnouncementViewProps['announcement'];

type AnnouncementLoaderFunction = (
  key: string,
) => Promise<Announcement | undefined> | Announcement | undefined;

export type ChannelViewProps = {
  channel?: Channel;
  announcementHrefPrefix: string;
  announcementKeys?: string[];
  announcementLoader?: AnnouncementLoaderFunction;
};
