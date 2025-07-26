import {
  getFormFileOrString,
  getFormFilesOrStrings,
  getFormNumber,
  getFormString,
} from '$lib/utils/form';
import { getUserIDNoRedirect } from '$lib/utils/getUserID';
import {
  ANNOUNCEMENT_BODY_MAX_BYTES,
  ANNOUNCEMENT_IMAGE_MAX_BYTES,
  ANNOUNCEMENT_TITLE_MAX_BYTES,
  STORAGE_ID_MAX_BYTES,
} from '@announcing/db/constants';
import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  const { channelID, announcementID } = params;

  const result = await locals.db.getAnnouncement({ channelID, announcementID });
  if (!result) {
    error(404, 'Missing announcement');
  }

  return json(result);
};

const putSchema = v.strictObject({
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
    v.pipe(v.string(), v.nonEmpty(), v.maxBytes(STORAGE_ID_MAX_BYTES)),
    v.undefined(),
  ]),
  images: v.union([
    v.array(
      v.union([
        v.pipe(
          v.blob(),
          v.mimeType(['image/jpeg', 'image/png', 'image/webp']),
          v.maxSize(ANNOUNCEMENT_IMAGE_MAX_BYTES),
        ),
        v.pipe(v.string(), v.nonEmpty(), v.maxBytes(STORAGE_ID_MAX_BYTES)),
      ]),
    ),
    v.undefined(),
  ]),
  targetUpdatedAt: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const PUT: RequestHandler = async ({ locals, params, request, getClientAddress }) => {
  const userID = await getUserIDNoRedirect(locals);
  if (!userID) {
    error(400, 'Missing userID');
  }

  const formData = await request.formData();

  const data = {
    title: getFormString(formData, 'title'),
    body: getFormString(formData, 'body'),
    headerImage: getFormFileOrString(formData, 'headerImage'),
    images: getFormFilesOrStrings(formData, 'images'),
    targetUpdatedAt: getFormNumber(formData, 'targetUpdatedAt'),
  };

  if (!v.is(putSchema, data)) {
    error(400, 'Schema Error');
  }

  const channelID = params.channelID;
  const targetAnnouncementID = params.announcementID;

  const announcementValues = await locals.db.updateAnnouncement({
    userID,
    channelID,
    targetAnnouncementID,
    ...data,
  });

  if (announcementValues) {
    await locals.storePostLog({
      ...announcementValues,
      ip: getClientAddress(),
      prevAnnouncementID: targetAnnouncementID,
    });
  }

  return json({});
};

const deleteSchema = v.strictObject({
  updatedAt: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const DELETE: RequestHandler = async ({ locals, params, request }) => {
  const userID = await getUserIDNoRedirect(locals);
  if (!userID) {
    error(400, 'Missing userID');
  }

  const data = await request.json();
  if (!v.is(deleteSchema, data)) {
    error(400, 'Schema Error');
  }

  const { channelID, announcementID } = params;

  await locals.db.removeAnnouncement({
    userID,
    channelID,
    targetAnnouncementID: announcementID,
    targetUpdatedAt: data.updatedAt,
  });

  return json({});
};
