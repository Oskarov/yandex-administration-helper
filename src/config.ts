const ENV = process.env;

const config = {
  host: `${ENV.REACT_APP_API_HOST}`,
  token: `${ENV.REACT_APP_API_TOKEN}`,
  orgId: `${ENV.REACT_APP_API_ORG_ID}`,
};

export default config;
