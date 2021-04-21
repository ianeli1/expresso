import { createServer, RequestListener, Server } from "http";
import { Router } from "./Router";
import { Request, Response } from "./types";

export class Expresso extends Router {
  server: Server;
  port: number;
  constructor() {
    super();
    this.requestHandler = this.requestHandler.bind(this);
  }

  private requestHandler: RequestListener = (req, res) => {
    const request: Request = {
      method: req.method!,
      url: req.url!,
      params: {},
    };
    const response: Response = {};
    this.handler(req.url!, request, response)
      .then((content) => {
        res.writeHead(response.status ?? 200, {
          "Content-Type": "text/html",
        });
        res.write(content, "utf-8");
        res.end();
      })
      .catch((e) => {
        console.log(e);
        res.writeHead(500);
        res.end("Oops2");
      });
  };

  listen(port: number, callback?: () => void) {
    this.server = createServer(this.requestHandler);
    this.port = port;
    this.server.listen(port, callback);
  }
}
