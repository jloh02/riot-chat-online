import axios, { AxiosInstance } from "axios";
import { Agent } from "https";

const VERSION = {
  buildNumber: "",
  riotClientVersion: "",
};

// Getters for version variables
export function getBuildNumber() {
  return VERSION.buildNumber;
}
export function getRiotClientVersion() {
  return VERSION.riotClientVersion;
}

const CIPHERS = [
  "TLS_CHACHA20_POLY1305_SHA256",
  "TLS_AES_128_GCM_SHA256",
  "TLS_AES_256_GCM_SHA384",
  "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
];
const CUSTOM_AGENT = new Agent({
  ciphers: CIPHERS.join(":"),
  honorCipherOrder: true,
  minVersion: "TLSv1.2",
});

const headers = {
  "Content-Type": "application/json",
  "User-Agent": `RiotClient/${VERSION.buildNumber} rso-auth (Windows; 10;;Professional, x64)`,
};

export const axiosFetch: AxiosInstance = axios.create({
  headers,
  httpsAgent: CUSTOM_AGENT,
  withCredentials: true,
});

export async function updateBuildVersions() {
  try {
    const verRes = await axios.get("https://valorant-api.com/v1/version");
    VERSION.buildNumber = verRes.data.data.riotClientBuild;
    VERSION.riotClientVersion = verRes.data.data.version;
    if (!VERSION.buildNumber || !VERSION.riotClientVersion) {
      console.error("Undefined buildNumber and riotClientVersion: " + VERSION);
    }
  } catch (err) {
    console.error("Unable to get client build version: ", err);
  }
}
