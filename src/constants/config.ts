import { ENV } from '@utils/env';

interface Config {
  docs: {
    baseUrl: string;
  };
}

export const config: Config = {
  docs: {
    baseUrl: ENV.DOCS_BASE_URL,
  },
};
