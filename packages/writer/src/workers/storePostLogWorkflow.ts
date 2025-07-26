import { WorkflowEntrypoint, WorkflowStep, type WorkflowEvent } from 'cloudflare:workers';

export type StorePostLogParams = {
  userID: string;
  channelID: string;
  announcementID: string;
  headerImage?: string | null | undefined;
  title?: string | null | undefined;
  body: string;
  images?: string[] | null | undefined;
  createdAt: number;
  updatedAt: number;
  ip: string;
  prevAnnouncementID?: string;
};

export type StorePostLogWorkflow = Workflow<StorePostLogParams>;

export class StorePostLogWorkflowEntrypoint extends WorkflowEntrypoint<
  {
    R2_POST_LOG: R2Bucket;
  },
  StorePostLogParams
> {
  override async run({ payload }: WorkflowEvent<StorePostLogParams>, step: WorkflowStep) {
    await step.do(
      'Store post log',
      {
        retries: {
          limit: 10,
          delay: '1 hour',
          backoff: 'exponential',
        },
      },
      async () => {
        const { channelID, announcementID, updatedAt } = payload;
        const key = `${channelID}/${new Date(updatedAt).toISOString()}-${announcementID}.json`;
        await this.env.R2_POST_LOG.put(key, JSON.stringify(payload));
      },
    );
  }
}
