interface IErrorCodeMessage {
  errorCode: number | string;
  errorMessage: string;
}
interface IError {
  errors?: IErrorCodeMessage[];
  errorMessage: string;
  statusCode: number | string;
}

export { IErrorCodeMessage, IError };
