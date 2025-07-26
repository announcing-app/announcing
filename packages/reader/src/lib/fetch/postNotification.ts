export const postNotification = async (data: { token: string; tags: string[] }) => {
  const res = await fetch(`/api/notification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Post Notification Error');
  }
};
