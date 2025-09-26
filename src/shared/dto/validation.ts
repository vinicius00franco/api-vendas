export type ValidationSuccess<T> = {
  success: true;
  data: T;
};

export type ValidationError = {
  success: false;
  message: string;
  status?: number;
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

export function validationSuccess<T>(data: T): ValidationSuccess<T> {
  return { success: true, data };
}

export function validationError(message: string, status = 400): ValidationError {
  return { success: false, message, status };
}
