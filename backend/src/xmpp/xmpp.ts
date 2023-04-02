import { xml, client } from "./custom/riot-xmpp.js";
import axios from "axios";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { Agent } from "https";
import { exit } from "process";
import { createInterface } from "readline";

const input = createInterface({
  input: process.stdin,
  output: process.stdout,
});
const it = input[Symbol.asyncIterator]();

const ciphers = [
  "TLS_CHACHA20_POLY1305_SHA256",
  "TLS_AES_128_GCM_SHA256",
  "TLS_AES_256_GCM_SHA384",
  "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
];
const agent = new Agent({
  ciphers: ciphers.join(":"),
  honorCipherOrder: true,
  minVersion: "TLSv1.2",
});

function getTokensFromUri(uri) {
  const url = new URL(uri);
  const params = new URLSearchParams(url.hash.substring(1));
  const access_token = params.get("access_token");
  const id_token = params.get("id_token");
  const expires_in = parseInt(params.get("expires_in"));

  return { access_token, id_token, expires_in };
}

function saveCookies(headers, cookieHeader, key) {
  headers["Cookie"] = cookieHeader.find((v) => RegExp(`^${key}`).test(v));
}

async function create(username, password) {
  const network = axios.create();

  const verRes = await axios.get("https://valorant-api.com/v1/version");
  const buildNumber = verRes.data["data"]["riotClientBuild"];
  const riotClientVersion = verRes.data["data"]["version"];

  const headers = {
    "Content-Type": "application/json",
    "User-Agent": `RiotClient/${buildNumber} rso-auth (Windows; 10;;Professional, x64)`,
  };

  const config = {
    headers: headers,
    httpsAgent: agent,
    withCredentials: true,
  };

  let RSOtoken;
  let idToken;

  const filename = `cookie_${username}.txt`;
  if (existsSync(filename)) {
    const json = JSON.parse(readFileSync(filename, "utf-8"));
    if (json.expire > Date.now()) {
      headers["Cookie"] = json.cookie;
      RSOtoken = json.RSOtoken;
      idToken = json.idToken;
    } else {
      const access_tokens = await axios.post(
        "https://auth.riotgames.com/api/v1/authorization",
        {
          client_id: "play-valorant-web-prod",
          nonce: 1,
          redirect_uri: "https://playvalorant.com/opt_in",
          response_type: "token id_token",
          scope: "account openid",
        },
        {
          headers: {
            Cookie: json.cookie,
            "User-Agent": `RiotClient/${buildNumber} rso-auth (Windows; 10;;Professional, x64)`,
          },
          httpsAgent: agent,
        }
      );

      saveCookies(headers, access_tokens.headers["set-cookie"], "ssid");

      const { access_token, id_token, expires_in } = getTokensFromUri(
        access_tokens.data.response.parameters.uri
      );
      RSOtoken = access_token;
      idToken = id_token;

      writeFileSync(
        filename,
        JSON.stringify({
          expire: Date.now() + expires_in * 1000,
          cookie: headers["Cookie"],
          RSOtoken: RSOtoken,
          idToken: idToken,
        })
      );
    }
  }

  if (!RSOtoken) {
    const cookieRes = await network.post(
      "https://auth.riotgames.com/api/v1/authorization",
      {
        client_id: "play-valorant-web-prod",
        nonce: 1,
        redirect_uri: "https://playvalorant.com/opt_in",
        response_type: "token id_token",
        scope: "account openid",
      },
      config
    );
    saveCookies(headers, cookieRes.headers["set-cookie"], "asid");

    let authRes = await network.put(
      "https://auth.riotgames.com/api/v1/authorization",
      {
        type: "auth",
        username: username,
        password: password,
        remember: true,
        language: "en_US",
      },
      config
    );
    saveCookies(headers, authRes.headers["set-cookie"], "ssid");

    console.log(authRes.data);

    while (authRes.data.type !== "response") {
      console.log("Enter 2FA Code: ");
      const line = await it.next();

      authRes = await axios
        .put(
          "https://auth.riotgames.com/api/v1/authorization",
          {
            type: "multifactor",
            code: line.value,
            rememberDevice: true,
          },
          config
        )
        .catch((err) => {
          if (err.response?.data?.error === "rate_limited")
            console.error("2FA Rate Limited");
          else console.error("Unknown 2FA error");
          exit(0);
        });

      console.log(authRes.data);
      saveCookies(headers, authRes.headers["set-cookie"], "ssid");
    }

    const { access_token, id_token, expires_in } = getTokensFromUri(
      authRes.data.response.parameters.uri
    );
    RSOtoken = access_token;
    idToken = id_token;

    writeFileSync(
      filename,
      JSON.stringify({
        expire: Date.now() + expires_in * 1000,
        cookie: headers["Cookie"],
        RSOtoken: RSOtoken,
        idToken: idToken,
      })
    );
  }

  const entRes = await network.post(
    "https://entitlements.auth.riotgames.com/api/token/v1",
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RSOtoken}`,
      },
    }
  );
  const entToken = entRes.data.entitlements_token;

  // const pasGeoRes = await network.put(
  //   "https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant",
  //   { id_token: idToken },
  //   {
  //     headers: {
  //       Authorization: `Bearer ${RSOtoken}`,
  //     },
  //   }
  // );
  // const PASregionToken = pasGeoRes.data.token;
  // const region = pasGeoRes.data.affinities.live;

  const PASres = await network.get(
    "https://riot-geo.pas.si.riotgames.com/pas/v1/service/chat",
    {
      headers: {
        Authorization: `Bearer ${RSOtoken}`,
      },
    }
  );
  const PAStoken = PASres.data;
  const PASregion = JSON.parse(
    Buffer.from(PAStoken.split(".")[1], "base64").toString()
  ).affinity;

  const xmppServerRes = await network.get(
    `https://clientconfig.rpg.riotgames.com/api/v1/config/player?os=windows&region=${PASregion}&app=Riot%20Client&version=${riotClientVersion}&patchline=KeystoneFoundationLiveWin`,
    {
      headers: {
        "x-riot-entitlements-jwt": entToken,
        authorization: `Bearer ${RSOtoken}`,
      },
    }
  );
  const XMPPserver = xmppServerRes.data["chat.affinities"][PASregion];
  const XMPPregion = xmppServerRes.data["chat.affinity_domains"][PASregion];

  const PORT = 5223;

  const xmpp = client({
    service: `xmpps://${XMPPserver}:${PORT}`,
    domain: `${XMPPregion}.pvp.net`,
    credentials: async (authCallback, mechanism) => {
      console.log(mechanism);
      try {
        await authCallback({
          rso_token: RSOtoken,
          pas_token: PAStoken,
        });
      } catch (e) {
        throw e;
      }
    },
  });

  // debug(xmpp);

  xmpp.on("error", (err) => {
    console.error(err);
  });

  xmpp.on("offline", () => {
    console.log("Riot XMPP Offline");
  });

  const TARGET_PUUID = "e0a26640-cbed-59e6-9644-933c8113bee8";
  let TARGET_JID;
  let userLink, puuid, userServerLink;

  // let done = false;
  // xmpp.on("stanza", async (stanza) => {
  //   if (stanza.children[0] && stanza.children[0].name === "query" && !done) {
  //     userLink = stanza.getAttr("to");
  //     userServerLink = stanza.getAttr("from");
  //     console.log(userLink);
  //     puuid = userLink.split("@")[0];
  //     done = true;
  //     // for (const x of stanza.children[0].children) {
  //     //   if (x.attrs.puuid === TARGET_PUUID) {
  //     //     console.log(x.attrs.jid);
  //     //     TARGET_JID = x.attrs.jid;
  //     //     const res = await xmpp.sendReceive(
  //     //       xml(
  //     //         "iq",
  //     //         { id: "get_archive_81239473128", type: "get" },
  //     //         xml(
  //     //           "query",
  //     //           { xmlns: "jabber:iq:riotgames:archive" },
  //     //           xml("with", {}, TARGET_JID)
  //     //         )
  //     //       )
  //     //     );
  //     //     console.log(res);
  //     //   }
  //     // }

  //     console.log("TEST");
  //     input.on("line", (line) => {
  //       xmpp.send(
  //         xml(
  //           "message",
  //           { id: `${Date.now()}:1`, to: TARGET_JID, type: "chat" },
  //           xml("body", {}, [line.trim()])
  //         )
  //       );
  //     });
  //   } else {
  //     console.log(stanza.toString());
  //   }
  // });

  xmpp.on("online", async (address) => {
    userLink = address;

    console.log(`Riot XMPP Online: ${address.toString()}`);
    await xmpp.send(
      xml(
        "iq",
        { id: "xmpp_entitlements_0", type: "set" },
        xml(
          "entitlements",
          { xmlns: "urn:riotgames:entitlements" },
          xml("token", { xmlns: "" }, entToken)
        )
      )
    );

    await xmpp.send(
      xml(
        "iq",
        { id: "2", type: "get" },
        xml("query", {
          xmlns: "jabber:iq:riotgames:roster",
          last_state: "true",
        })
      )
    );

    //Subscribe to presences
    await xmpp.send(xml("presence"));
  });

  xmpp.start().catch((e) => {
    console.error(e);
  });
}
