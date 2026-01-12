import { PipedreamClient } from '@pipedream/sdk';

let _pd: PipedreamClient | undefined;

export function pdClient(): PipedreamClient {
  if (_pd) return _pd;
  _pd = new PipedreamClient();
  return _pd;
}

export const pdHeaders = async (exuid: string) => {
  const accessToken = await pdClient().rawAccessToken;

  return {
    Authorization: `Bearer ${accessToken}`,
    "x-pd-project-id": process.env.PIPEDREAM_PROJECT_ID,
    "x-pd-environment": process.env.PIPEDREAM_PROJECT_ENVIRONMENT,
    "x-pd-external-user-id": exuid,
    "x-pd-tool-mode": "full-config",
    "x-pd-app-discovery": "true",
  };
};
