import { getFormFile, getFormString } from '$lib/utils/form';
import {
  CHANNEL_DESC_MAX_BYTES,
  CHANNEL_ICON_MAX_BYTES,
  CHANNEL_NAME_MAX_BYTES,
} from '@announcing/db/constants';
import { error, json } from '@sveltejs/kit';
import crypto from 'crypto';
import * as v from 'valibot';
import type { RequestHandler } from './$types';

const invalidChannelIDPattern = /(.)\1\1/;

const genChannelID = () => {
  for (;;) {
    const id = crypto.randomInt(10000000, 99999999).toString();

    if (!invalidChannelIDPattern.test(id)) {
      return id;
    }
  }
};

const postSchema = v.strictObject({
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
    v.undefined(),
  ]),
});

export const POST: RequestHandler = async ({ locals, request }) => {
  const session = await locals.auth();
  const userID = session?.user?.id;
  if (!userID) {
    error(400, 'Missing userID');
  }

  const formData = await request.formData();

  const data = {
    name: getFormString(formData, 'name'),
    desc: getFormString(formData, 'desc'),
    icon: getFormFile(formData, 'icon'),
  };

  if (!v.is(postSchema, data)) {
    error(400, 'Schema Error');
  }

  const channelID = genChannelID();

  await locals.db.createChannel({ ...data, channelID, userID });

  return json({});
};
