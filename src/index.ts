export { Expresso } from "./Expresso";
export { Router } from "./Router";
import https from "http";

interface FetchResult {
  json(): any;
  data: string;
}

//polyfill for fetch kinda
export function fetch(url: string) {
  return new Promise<FetchResult>((res, rej) => {
    https.get(url, (response) => {
      response.on("error", rej);
      let body = "";
      response.on("data", (e) => (body += e));
      response.on("end", () => {
        res({
          json() {
            return JSON.parse(body);
          },
          data: body,
        });
      });
    });
  });
}
