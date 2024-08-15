/* eslint-disable @typescript-eslint/no-explicit-any */
export enum HTTPMethod {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export enum InternalServerError {
  NoError = 0,
  GenericError = 1,
  InvalidEmailOrPassword = 100,
  UserAlreadyExistsForEmail = 101,
  ExpiredToken = 102,
}

export type BaseServerResponse<T> = {
  data: T | null;
  error: boolean;
  errorText: string | null;
  internalErrorCode: number;
};

export class FetchError extends Error {
  message: string;
  internalCode: number;
  responseStatusCode: number;

  constructor(
    message: string,
    internalCode: number,
    responseStatusCode: number
  ) {
    super(message);

    this.message = message;
    this.internalCode = internalCode;
    this.responseStatusCode = responseStatusCode;
  }

  internalServerErrorValue(): string {
    return InternalServerError[this.internalCode];
  }
}
