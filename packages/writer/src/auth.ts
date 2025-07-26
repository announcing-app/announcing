import { env } from '$env/dynamic/private';
import { PUBLIC_AUTH_CARDINALS } from '$env/static/public';
import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import Google from '@auth/sveltekit/providers/google';

const providers: SvelteKitAuthConfig['providers'] = [
  Google({
    clientId: env.AUTH_GOOGLE_ID,
    clientSecret: env.AUTH_GOOGLE_SECRET,
    authorization: {
      params: {
        scope: 'openid',
        prompt: 'select_account',
      },
    },
  }),
];

if (PUBLIC_AUTH_CARDINALS) {
  providers.push(
    Credentials({
      credentials: {
        id: {},
      },
      authorize: (credentials) => {
        return { id: credentials.id as string };
      },
    }),
  );
}

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers,
  callbacks: {
    jwt: ({ token, account }) => {
      if (account) {
        token['userID'] = `${account.provider}:${account.providerAccountId}`;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token['userID']) {
        session.user.id = token['userID'] as string;
      }

      return session;
    },
  },
  secret: env.AUTH_SECRET,
  trustHost: true,
  //https://github.com/nextauthjs/next-auth/issues/6451
  useSecureCookies: !!process.env['__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS'],
});
