type Channel = {
  name: string;
  desc: string | undefined;
  icon: string | undefined;
};

type Announcement = {
  headerImage?: string | undefined;
  title?: string | undefined;
  body: string;
  images?: string[] | undefined;
  updatedAt: number;
  createdAt: number;
};

export interface AnnouncementViewProps {
  channel?: Channel;
  announcement: Announcement;
}
