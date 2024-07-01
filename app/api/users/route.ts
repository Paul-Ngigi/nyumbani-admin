import { makeRequest } from "@/app/api/_utils/make-request";
import { baseUrl } from "@/constants/urls";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = `${baseUrl}/listusers`;
  const body = await req.json();
  const response = await makeRequest<any>(req, "POST", url, body);
  console.log({response});
  if (response.error) {
    console.error("Error fetching user details:", response.error);
    return NextResponse.json(
      { error: response.error },
      { status: response.status }
    );
  }
  const users = response;
  console.log({ "user(s):": users });
  return NextResponse.json(users);
}
