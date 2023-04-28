import { config } from "dotenv";

config();

let conf = {
  PORT: process.env.PORT || "3000",
  SSL_PASSPHRASE: process.env.SSL_PASSPHRASE,
  BUILD_REFRESH_FREQUENCY: parseInt(process.env.BUILD_REFRESH_FREQUENCY), //Get client build version every...
};

export default conf;
