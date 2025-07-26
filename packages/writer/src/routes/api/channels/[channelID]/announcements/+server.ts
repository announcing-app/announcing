import { getFormFile, getFormFiles, getFormString } from '$lib/utils/form';
import { getUserIDNoRedirect } from '$lib/utils/getUserID';
import {
  ANNOUNCEMENT_BODY_MAX_BYTES,
  ANNOUNCEMENT_IMAGE_MAX_BYTES,
  ANNOUNCEMENT_TITLE_MAX_BYTES,
} from '@announcing/db/constants';
import type { SendNotificationParams } from '@announcing/notification';
import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';

const postSchema = v.strictObject({
  title: v.union([
    v.pipe(v.string(), v.nonEmpty(), v.maxBytes(ANNOUNCEMENT_TITLE_MAX_BYTES)),
    v.undefined(),
  ]),
  body: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(ANNOUNCEMENT_BODY_MAX_BYTES)),
  headerImage: v.union([
    v.pipe(
      v.blob(),
      v.mimeType(['image/jpeg', 'image/png', 'image/webp']),
      v.maxSize(ANNOUNCEMENT_IMAGE_MAX_BYTES),
    ),
    v.undefined(),
  ]),
  images: v.union([
    v.array(
      v.pipe(
        v.blob(),
        v.mimeType(['image/jpeg', 'image/png', 'image/webp']),
        v.maxSize(ANNOUNCEMENT_IMAGE_MAX_BYTES),
      ),
    ),
    v.undefined(),
  ]),
});

export const POST: RequestHandler = async ({ locals, params, request, getClientAddress }) => {
  const userID = await getUserIDNoRedirect(locals);
  if (!userID) {
    error(400, 'Missing userID');
  }

  const formData = await request.formData();

  const data = {
    title: getFormString(formData, 'title'),
    body: getFormString(formData, 'body'),
    headerImage: getFormFile(formData, 'headerImage'),
    images: getFormFiles(formData, 'images'),
  };

  if (!v.is(postSchema, data)) {
    error(400, 'Schema Error');
  }

  const channelID = params.channelID;

  const channel = await locals.db.getChannel({ userID, channelID });
  if (!channel) {
    error(404, 'Missing channel');
  }

  const announcementValues = await locals.db.addAnnouncement({
    userID,
    channelID,
    ...data,
    createdAt: new Date().getTime(),
  });

  if (announcementValues) {
    const params: SendNotificationParams = {
      tag: channelID,
      message: {
        webpush: {
          headers: {
            TTL: '3600',
          },
          notification: {
            title: channel.name,
            body: data.title ?? data.body.substring(0, 200),
            tag: channelID,
            ...(channel.icon && { icon: `/s/${channel.icon}` }),
            ...(channel.icon && { badge: `/s/${channel.icon}` }),
            ...(announcementValues.headerImage && {
              image: `/s/${announcementValues.headerImage}`,
            }),
          },
        },
      },
    };

    locals.waitUntil(
      Promise.allSettled([
        locals.storePostLog({ ...announcementValues, ip: getClientAddress() }),
        locals.sendNotification(params),
      ]),
    );
  }

  return json({});
};
