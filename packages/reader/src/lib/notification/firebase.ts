import { PUBLIC_FIREBASE_CONFIG_JSON, PUBLIC_FIREBASE_VAPID_KEY } from '$env/static/public';
import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

let app: FirebaseApp | undefined;

const getFirebaseApp = () => {
  if (!app) {
    const firebaseConfig: FirebaseOptions = JSON.parse(PUBLIC_FIREBASE_CONFIG_JSON);
    app = initializeApp(firebaseConfig);
  }

  return app;
};

export const getNotificationToken = async () => {
  const serviceWorkerRegistration = await navigator.serviceWorker.getRegistration();
  if (!serviceWorkerRegistration) {
    throw new Error('Missing serviceWorkerRegistration');
  }

  const messaging = getMessaging(getFirebaseApp());

  const token = await getToken(messaging, {
    vapidKey: PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration,
  });

  return token;
};
