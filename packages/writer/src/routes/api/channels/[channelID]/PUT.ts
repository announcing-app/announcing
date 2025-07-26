import { getFormFileOrString, getFormNumber, getFormString } from '$lib/utils/form';
import { getUserIDNoRedirect } from '$lib/utils/getUserID';
import {
  CHANNEL_DESC_MAX_BYTES,
  CHANNEL_ICON_MAX_BYTES,
  CHANNEL_NAME_MAX_BYTES,
  STORAGE_ID_MAX_BYTES,
} from '@announcing/db/constants';
import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import type { RequestHandler } from './$types';

const putSchema = v.strictObject({
  name: v.pipe(v.string(), v.nonEmpty(), v.maxBytes(CHANNEL_NAME_MAX_BYTES)),
  desc: v.union([
    v.pipe(v.string(), v.nonEmpty(), v.maxBytes(CHANNEL_DESC_MAX_BYTES)),
    v.undefined(),
  ]),
  icon: v.union([
    v.pipe(
      v.blob(),
      v.mimeType(['image/jpeg', 'image/png', 'image/webp']),
      v.maxSize(CHANNEL_ICON_MAX_BYTES),
    ),
    v.pipe(v.string(), v.nonEmpty(), v.maxBytes(STORAGE_ID_MAX_BYTES)),
    v.undefined(),
  ]),
  updatedAt: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const PUT: RequestHandler = async ({ locals, params, request }) => {
  const userID = await getUserIDNoRedirect(locals);
  if (!userID) {
    error(400, 'Missing userID');
  }

  const formData = await request.formData();

  const data = {
    name: getFormString(formData, 'name'),
    desc: getFormString(formData, 'desc'),
    icon: getFormFileOrString(formData, 'icon'),
    updatedAt: getFormNumber(formData, 'updatedAt'),
  };

  if (!v.is(putSchema, data)) {
    error(400, 'Schema Error');
  }

  const channelID = params.channelID;

  await locals.db.updateChannel({ ...data, userID, channelID });

  return json({});
};
