import http from "http";
import io from "socket.io-client";
import { Server } from "socket.io";
import { Socket } from "socket.io-client";
import { createWebSocket } from "../src/socket";
import { startWebServer } from "../src/webserver";

let ioServer: Server;
let socketClient: Socket;
let httpServer: http.Server;

const PORT = 2222;

describe("Socket.io", () => {
  beforeEach((done) => {
    httpServer = startWebServer(
      PORT,
      (_, server) => (ioServer = createWebSocket(server)),
      () => {
        socketClient = io(`http://localhost:${PORT}`);
        done();
      }
    );
  });

  afterEach(() => {
    httpServer.close();
    socketClient.close();
    ioServer.close();
  });

  it("should connect", (done) => {
    socketClient.on("connect", () => done());
  });

  // it("should connect", (done) => {
  //   socketClient = io(`http://localhost:${port}`);

  //   socketClient.on("connect", () => {
  //     done();
  //   });

  //   // Listen for the "message" event and verify that the message is correct
  //   socketClient.on("message", (receivedMessage: string) => {
  //     expect(receivedMessage).toEqual(message);
  //     socketClient.disconnect();
  //     done();
  //   });
  // });
});
