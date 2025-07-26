export { PutTokenEntrypoint } from './putToken';
export { SendNotificationEntrypoint } from './sendNotification';

export default {
  fetch() {
    return Response.json({}, { status: 404 });
  },
};
