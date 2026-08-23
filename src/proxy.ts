import { NextResponse } from "next/server";
import { isLanOrigin } from "@/server/lanOrigin";

const ALLOWED_METHODS = "GET, POST, PUT, DELETE, OPTIONS";

export default function proxy(request: Request) {
  const origin = request.headers.get("origin");
  const isPreflight = request.method === "OPTIONS";

  if (!origin || !isLanOrigin(origin)) {
    return isPreflight ? new NextResponse(null, { status: 403 }) : undefined;
  }

  const response = isPreflight
    ? new NextResponse(null, { status: 204 })
    : NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Vary", "Origin");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
