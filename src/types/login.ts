export interface LoginRequestBody {
  username: string
  password: string
}

export interface LoginSuccessResponse {
  token: string
}