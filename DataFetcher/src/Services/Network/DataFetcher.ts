/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from "../AppEntities/User";
import {
  BaseServerResponse,
  FetchError,
  HTTPMethod,
  InternalServerError,
} from "./Entities";
import { ServerEndpoints } from "./ServerEndpoints";

export default async function performRequest<T>(
  method: HTTPMethod,
  path: string,
  body: any | null = null
): Promise<T | null> {
  // Build request
  const request = new Request(path, {
    body: body === null ? null : JSON.stringify(body),
    method: HTTPMethod[method],
    headers: {
      "Content-Type": "application/json",
      "Bearer-Token": retreiveAuthToken(),
    },
  });

  // Await response and decode
  const response = await fetch(request);
  const serverResponseBody = (await response.json()) as BaseServerResponse<T>;

  // Check if we received a token in order to store it locally
  const authToken = response.headers.get("Bearer-Token");
  if (authToken) {
    storeAuthToken(authToken);
  }

  // Check for error
  if (serverResponseBody.error) {
    // If exired token error trigger refresh
    if (
      serverResponseBody.internalErrorCode === InternalServerError.ExpiredToken
    ) {
      await refreshAuthToken();
      return performRequest(method, path, body);
    }
    throw new FetchError(
      serverResponseBody.errorText || "Fetch errror occured",
      serverResponseBody.internalErrorCode,
      response.status
    );
  }

  // Store user email and password on userMe fetch
  if (path === ServerEndpoints.userMe()) {
    storeUserEmailAndPassword(serverResponseBody.data as User);
  }

  // Return received data
  return serverResponseBody.data;
}

export function performLogOut() {
  localStorage.setItem("Bearer-Token", "");
  localStorage.setItem("email", "");
  localStorage.setItem("password", "");
}

// ---------- Private API ----------

function storeAuthToken(token: string) {
  localStorage.setItem("Bearer-Token", token);
}

function retreiveAuthToken(): string {
  return localStorage.getItem("Bearer-Token") || "";
}

function storeUserEmailAndPassword(user: User) {
  localStorage.setItem("email", user.email);
  localStorage.setItem("password", user.password);
}

function retreiveUserEmailAndPassword(): string[] {
  const email = localStorage.getItem("email") || "";
  const password = localStorage.getItem("password") || "";
  return [email, password];
}

async function refreshAuthToken() {
  const [email, password] = retreiveUserEmailAndPassword();
  const userData = {
    email: email,
    password: password,
  };
  try {
    await performRequest(
      HTTPMethod.POST,
      ServerEndpoints.refreshToken(),
      userData
    );
  } catch (error) {
    console.log(`💥 Failed to perform auth token refresh with error: ${error}`);
    throw error;
  }
}
