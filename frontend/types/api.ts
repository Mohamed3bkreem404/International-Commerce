export type ApiStatus = "Success" | "Error";

export type ApiErrorItem = {
  message: string;
};

export type ApiResponse<T> = {
  status: ApiStatus;
  data: T;
  errors: ApiErrorItem[];
};
