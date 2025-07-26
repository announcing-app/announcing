const sizePattern = new RegExp('([0-9]+)x([0-9]+)');

export const parseImageSize = (src: string) => {
  const m = sizePattern.exec(src);
  if (!m) {
    return;
  }
  const [, w, h] = m;
  if (!w || !h) {
    return;
  }
  return {
    width: +w,
    height: +h,
  };
};
