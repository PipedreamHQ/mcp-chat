import { BackendClient, createBackendClient, ProjectEnvironment } from '@pipedream/sdk/server';

let _pd: BackendClient | undefined;

export function pdClient(): BackendClient {
  if (_pd) return _pd;
  _pd = createBackendClient({
    environment: (process.env.PIPEDREAM_PROJECT_ENVIRONMENT || 'production') as ProjectEnvironment,
    credentials: {
      clientId: process.env.PIPEDREAM_CLIENT_ID!,
      clientSecret: process.env.PIPEDREAM_CLIENT_SECRET!,
    },
    projectId: process.env.PIPEDREAM_PROJECT_ID!,
  });
  return _pd;
}

export const pdHeaders = async (exuid: string) => {
  const accessToken = await pdClient().rawAccessToken();

  return {
    Authorization: `Bearer ${accessToken}`,
    "x-pd-project-id": process.env.PIPEDREAM_PROJECT_ID,
    "x-pd-environment": process.env.PIPEDREAM_PROJECT_ENVIRONMENT,
    "x-pd-external-user-id": exuid,
  };
};