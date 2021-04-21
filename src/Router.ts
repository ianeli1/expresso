import { RequestHandler, Request, Response } from "./types";

interface Routes {
  [routeName: string]: Router | Dictionary;
}

interface Dictionary {
  [methodName: string]: RequestHandler;
}

export class Router {
  routes: Routes;
  wildcard: string | false = false;
  wildcardDict: Dictionary = {};
  constructor() {
    this.routes = {};
  }

  protected async handler(
    route: string,
    req: Request,
    res: Response
  ): Promise<string> {
    const [, routeName, ...rest] = route.split("/").map((x) => `/${x}`);
    const thisRoute = this.routes[routeName];
    if (!thisRoute && !this.wildcard) {
      return this.error();
    }
    if (thisRoute instanceof Router) {
      return thisRoute.handler(rest.join(""), req, res);
    }
    if (thisRoute && req.method in thisRoute) {
      return thisRoute[req.method](req, res);
    }
    if (this.wildcard !== false) {
      req.params[this.wildcard] = routeName.slice(1);
      return req.method in this.wildcardDict
        ? this.wildcardDict[req.method](req, res)
        : this.error();
    }

    return this.error();
  }

  addRoute(method: string, routeName: string, handler: RequestHandler) {
    if (routeName.includes(":")) {
      this.wildcard = routeName.slice(2);
      this.wildcardDict[method] = handler;
      return;
    }
    if (!this.routes[routeName]) this.routes[routeName] = {};
    (this.routes[routeName] as Dictionary)[method] = handler;
    console.log(`Route ${routeName} was added, with method ${method}`);
    return;
  }

  get(routeName: string, handler: RequestHandler) {
    this.addRoute("GET", routeName, handler);
  }

  post(routeName: string, handler: RequestHandler) {
    this.addRoute("POST", routeName, handler);
  }

  use(routeName: string, router: Router) {
    this.routes[routeName] = router;
  }

  private error() {
    return "Oops";
  }
}
