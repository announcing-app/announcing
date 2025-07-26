import { imageSize } from 'image-size';
import { encodeBase64Url } from './encodeBase64Url';

const typeReplaceMap = new Map([['jpg', 'jpeg']]);

export const genStorageKey = async (blob: Blob) => {
  const ab = new Uint8Array(await blob.arrayBuffer());

  const digest = await crypto.subtle.digest('SHA-256', ab);
  const hash = encodeBase64Url(new Uint8Array(digest));

  try {
    const size = imageSize(ab);

    const mimeType = size.type ? `image/${typeReplaceMap.get(size.type) ?? size.type}` : blob.type;

    if (size.type) {
      return [`${hash}_${size.width}x${size.height}.${size.type}`, ab, mimeType] as const;
    } else {
      return [`${hash}_${size.width}x${size.height}`, ab, mimeType] as const;
    }
  } catch (err) {
    if (err instanceof TypeError) {
      return [hash, ab, blob.type] as const;
    }
    throw err;
  }
};
