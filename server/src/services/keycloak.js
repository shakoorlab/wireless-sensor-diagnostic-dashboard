// TOKEN AQUISITION FOR SERVER-TO-SERVER COMMUNICATION

// In multi-instance deployments you would instead cache in Redis or rely on each instance refreshing separately.

import axios from "axios";
import env from "../config/env.js";

let cached = null;
const marginSec = 30;

async function fetchToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", env.keycloak.clientId);
  params.append("username", env.keycloak.username);
  params.append("password", env.keycloak.password);

  const res = await axios.post(env.keycloak.tokenUrl, params);
  const ttl = res.data.expires_in;
  const expiry = Date.now() + (ttl - marginSec) * 1000;
  cached = { token: res.data.access_token, expiresAt: expiry };
  return cached.token;
}

export async function getBearerToken() {
  if (cached && Date.now() < cached.expiresAt) {
    return cached.token;
  }
  return fetchToken();
}
