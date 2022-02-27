export interface INominativRequestParams {
  format: string;
  limit: number;
  dedupe: number;
  q: string;
}

export enum RequestTypeEnum {
  SEARCH = "search",
  REVERSE = "reverse",
  LOOKUP = "lookup",
}

export class IDownloader {
  static nominativRequest(
    params: INominativRequestParams,
    requestType: RequestTypeEnum,
    pause = 1,
    errorPause = 60
  ) {}
}
