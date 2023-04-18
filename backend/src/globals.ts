import axios from "axios";
import { Agent } from "https";
import { exit } from "process";

export let buildNumber: string, riotClientVersion: string;

axios
  .get("https://valorant-api.com/v1/version")
  .then((verRes) => {
    buildNumber = verRes.data.data.riotClientBuild;
    riotClientVersion = verRes.data.data.version;
    if (!buildNumber || !riotClientVersion) {
      throw Error(
        "Undefined buildNumber and riotClientVersion: " +
          { buildNumber, riotClientVersion }
      );
    }
  })
  .catch((err) => {
    console.error("Unable to get client build version: ", err);
    exit(1);
  });

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

export const axiosFetch = axios.create({
  headers: {
    "Content-Type": "application/json",
    "User-Agent": `RiotClient/${buildNumber} rso-auth (Windows; 10;;Professional, x64)`,
  },
  httpsAgent: CUSTOM_AGENT,
  withCredentials: true,
});
