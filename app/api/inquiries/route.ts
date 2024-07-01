import { makeRequest } from "@/app/api/_utils/make-request";
import { baseUrl } from "@/constants/urls";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = `${baseUrl}/listapartments`;
  const body = await req.json();  
  const response = await makeRequest<any>(req, "POST", url, body);
  if (response.error) {
    console.error("Error fetching inquiries", response.error);
    return NextResponse.json(
      { error: response.error },
      { status: response.status }
    );
  }
  const inquiries = response;
  console.log({inquiries});
  return NextResponse.json(inquiries);
}
