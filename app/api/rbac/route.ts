import { makeRequest } from "@/app/api/_utils/make-request";
import { baseUrl } from "@/constants/urls";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = `${baseUrl}/adminlistrbactasks`;
  const body = await req.json();  
  const response = await makeRequest<any>(req, "POST", url, body);
  if (response.error) {
    console.error("Error fetching rbac details:", response.error);
    return NextResponse.json(
      { error: response.error },
      { status: response.status }
    );
  }
  const rbac = response;  
  console.log({rbac})
  return NextResponse.json(rbac);
}
