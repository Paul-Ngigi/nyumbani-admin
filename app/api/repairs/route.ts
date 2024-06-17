import { makeRequest } from "@/app/api/_utils/make-request";
import { baseUrl } from "@/constants/urls";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = `${baseUrl}/listorganisations`;
  const body = await req.json();  
  const response = await makeRequest<any>(req, "POST", url, body);
  if (response.error) {
    console.error("Error fetching organisation details:", response.error);
    return NextResponse.json(
      { error: response.error },
      { status: response.status }
    );
  }
  const organisation = response;
  console.log({organisation});
  return NextResponse.json(organisation);
}
