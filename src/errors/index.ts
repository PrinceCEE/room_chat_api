enum HttpStatusCodes {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  REQUEST_TIMEOUT = 408,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
}

export class ServerError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: HttpStatusCodes) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotImplementedError extends ServerError {
  constructor(msg?: string) {
    if(!msg) msg = "Not Implemented";
    super(msg, HttpStatusCodes.NOT_IMPLEMENTED);
  }
}

export class BadrequestError extends ServerError {
  constructor(msg?: string) {
    if(!msg) msg = "Bad request";
    super(msg, HttpStatusCodes.BAD_REQUEST);
  }
}

export class UnauthorisedError extends ServerError {
  constructor(msg?: string) {
    if(!msg) msg = "Unauthorised";
    super(msg, HttpStatusCodes.UNAUTHORIZED);
  }
}

export class NotFoundError extends ServerError {
  constructor(msg?: string) {
    if(!msg) msg = "Not found";
    super(msg, HttpStatusCodes.NOT_FOUND);
  }
}

export class RequestTimeoutError extends ServerError {
  constructor(msg?: string) {
    if(!msg) msg = "Request timed out";
    super(msg, HttpStatusCodes.REQUEST_TIMEOUT);
  }
}

export class InternalServerError extends ServerError {
  constructor(msg?: string) {
    if(!msg) msg = "Internal server error";
    super(msg, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}