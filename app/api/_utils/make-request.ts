import { useSession } from "next-auth/react";
import { NextRequest } from "next/server";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}
//TODO: You can customize the error response text for admin.
export async function makeRequest<T>(
  req: NextRequest,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  url: string,
  body: any = undefined,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> {
  try {
    const skey = req.headers.get("skey") || "";

    const res = await fetch(url, {
      method,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        skey,
        ...headers,
      },
      body: JSON.stringify(body),
    });

    // Check for errors based on API response structure:
    if (!res.ok) {
      const errorData = await res.json();

      console.error(JSON.stringify(errorData));

      console.log("Status", res.status);

      let errorMessage = "";

      // Check for string error
      if (res.status === 422) {
        errorMessage =
          "Oops! It seems there's a small hiccup with the information you provided. No worries, we're on it!";
      } else {
        errorMessage = errorData.detail;
        console.error("Error with detail key:", errorData);
      }

      return { data: null, error: errorMessage, status: res.status };
    }

    // Extract and return the successful response data:
    const data = res.ok && res.status !== 204 ? await res.json() : null; // Handle
    return { data, error: null, status: res.status };
  } catch (e) {
    // Handle unexpected errors:
    console.error(JSON.stringify(e));
    return {
      data: null,
      error:
        "Oops! Something went wrong on our end. We're working to fix it, please try again later.",
      status: 500,
    };
  }
}
