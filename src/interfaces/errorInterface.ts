export interface IGenericErrorMessage {
  path: string
  message: string
}

export interface IGenericErrorResponse {
  status: string
  statusCode: number
  message: any
  errorMessages: IGenericErrorMessage[]
}
