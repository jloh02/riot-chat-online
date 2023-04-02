"use strict";

//Adapted from https://github.com/jaredhanson/js-sasl-plain/blob/master/lib/mechanism.js

import { xml } from "./riot-xmpp.js";

function Mechanism() {}

Mechanism.prototype.name = "X-Riot-RSO-PAS";
Mechanism.prototype.clientFirst = true;

/**
 * Encode a response using given credential.
 *
 * Options:
 *  - `rso_token`
 *  - `pas_token`
 *
 * @param {Object} cred
 * @api public
 */
Mechanism.prototype.response = function (cred) {
  return [
    xml("rso_token", {}, cred.rso_token),
    xml("pas_token", {}, cred.pas_token),
  ];
};

/**
 * Decode a challenge issued by the server.
 *
 * @param {String} chal
 * @return {Mechanism} for chaining
 * @api public
 */
Mechanism.prototype.challenge = function (chal) {
  return this;
};

export default function saslRiot(sasl) {
  sasl.use(Mechanism);
}
