import { AntAuth } from '@gi4nks/ant';

export const auth = new AntAuth({
  secret: process.env.ANT_JWT_SECRET || 'atlas-secret-key-12345-very-long-and-secure-default',
  user: process.env.ATLAS_AUTH_USER || process.env.atlas_AUTH_USER,
  password: process.env.ATLAS_AUTH_PASSWORD || process.env.atlas_AUTH_PASSWORD,
  sessionCookieName: 'atlas_session',
});

export default auth;
