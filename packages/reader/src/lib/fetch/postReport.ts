export const postReport = async (data: {
  channelID: string;
  announcementID: string;
  details: string;
}) => {
  const res = await fetch(`/api/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Post Report Error');
  }
};
