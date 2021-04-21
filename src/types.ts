export type RequestHandler = (
  req: Request,
  res: Response
) => Promise<any> | any;

export interface Request {
  method: string;
  url: string;
  params: {
    [name: string]: string;
  };
}

export interface Response {
  status?: number;
  contentType?: string;
}
