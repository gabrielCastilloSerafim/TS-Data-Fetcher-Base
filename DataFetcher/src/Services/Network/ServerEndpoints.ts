export class ServerEndpoints {
  static baseURL = "http://localhost:3000/api/v1";

  static signUp(): string {
    return `${ServerEndpoints.baseURL}/auth/signup`;
  }

  static login(): string {
    return `${ServerEndpoints.baseURL}/auth/login`;
  }

  static refreshToken(): string {
    return `${ServerEndpoints.baseURL}/auth/refresh`;
  }

  static userMe(): string {
    return `${ServerEndpoints.baseURL}/user/me`;
  }
}
