// Type definitions for @xmpp/client 0.13
// Project: https://github.com/xmppjs/xmpp.js/tree/main/packages/client
// Definitions by: BendingBender <https://github.com/BendingBender>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import {
  Client as ClientCore,
  jid as xmppJid,
  xml as xmppXml,
} from "@xmpp/client-core";
import { Options as ConnectionOptions } from "@xmpp/connection";
import { IQCallee } from "@xmpp/iq/callee";
import { IQCaller } from "@xmpp/iq/caller";
import { IncomingContext, Middleware } from "@xmpp/middleware";
import { StreamFeatures } from "@xmpp/stream-features";
import { Reconnect } from "@xmpp/reconnect";
import { Resource } from "@xmpp/resource-binding";
import { SASL } from "@xmpp/sasl";
import { StreamManagement } from "@xmpp/stream-management";
import * as koaCompose from "koa-compose";

export function client(options?: Options): Client;

export interface Options extends ConnectionOptions {
  resource?: Resource | undefined;
  credentials?: (
    callback: (credentials: {
      rso_token: string;
      pas_token: string;
    }) => Promise<void>,
    mechanism: string
  ) => Promise<void> | undefined;
  username?: string | undefined;
  password?: string | undefined;
}

export interface Client extends ClientCore {
  entity: Client;
  reconnect: Reconnect<Client>;
  middleware: Middleware<Client>;
  streamFeatures: StreamFeatures<Client>;
  iqCaller: IQCaller<Client>;
  iqCallee: IQCallee<Client>;
  starttls: koaCompose.Middleware<IncomingContext<Client>>;
  sasl: SASL;
  streamManagement: StreamManagement;
  mechanisms: Array<{ riotRsoPas: undefined }>;
}

export const jid: typeof xmppJid;
export const xml: typeof xmppXml;
