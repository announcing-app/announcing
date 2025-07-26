export const toStyle = (m: Record<string, string | undefined> | undefined) => {
  if (!m) {
    return;
  }

  const result = [];

  for (const [k, v] of Object.entries(m)) {
    if (v) {
      result.push(`${k}: ${v}`);
    }
  }

  return result.join(';');
};
