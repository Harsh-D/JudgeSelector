export function getConfig() {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE
  return {
    domain: domain,
    clientId: clientId,
    ...(audience ? { audience } : null),
  };
}
