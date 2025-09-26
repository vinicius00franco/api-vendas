export enum ErrorCodes {
  VALIDATION_ERROR = "validation_error",
  NOT_FOUND = "not_found",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  INTERNAL = "internal_error",
  BAD_REQUEST = "bad_request",
}

export function codeForStatus(status: number): ErrorCodes {
  if (status === 401) return ErrorCodes.UNAUTHORIZED;
  if (status === 403) return ErrorCodes.FORBIDDEN;
  if (status === 404) return ErrorCodes.NOT_FOUND;
  if (status >= 500) return ErrorCodes.INTERNAL;
  if (status === 400) return ErrorCodes.VALIDATION_ERROR;
  return ErrorCodes.BAD_REQUEST;
}
