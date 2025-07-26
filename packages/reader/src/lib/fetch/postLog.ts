export const postLog = async (data: unknown) => {
  const res = await fetch(`/api/log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ua: navigator.userAgent, log: data }),
  });

  if (!res.ok) {
    throw new Error('Post Log Error');
  }
};
