export class ApiClientError extends Error {
  statusCode?: number;
  errors?: string[];

  constructor(message: string, statusCode?: number, errors?: string[]) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
