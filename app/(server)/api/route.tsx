import { NextResponse } from "next/server";
import Ably from "ably";

export const revalidate = 0;
export const dynamic = "force-static";
export async function GET() {
  const client = new Ably.Rest(process.env.ABLY_API_KEY!);
  // Issue a server token that covers both the base channel and any suffixed private-chat channels
  const capability = JSON.stringify({
    "private-chat": ["subscribe", "publish"],
    "private-chat:*": ["subscribe", "publish"]
  });

  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: "server-chat",
    capability,
  });
  console.log("Issued server token with capability:", capability);
  return NextResponse.json(tokenRequestData, { status: 200 });
}
