import { NextResponse, NextRequest } from "next/server";
import Ably from "ably";

export const revalidate = 0;
export const dynamic = "force-static";
async function createToken(userA: string, userB: string, clientId: string) {
  if (clientId !== userA && clientId !== userB) {
    const res = NextResponse.json({ error: "Unauthorized clientId" }, { status: 403 });
    throw res;
  }

  const ids = [userA, userB].sort();
  const channelName = `private-chat:${ids[0]}:${ids[1]}`;

  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    const res = NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    throw res;
  }

  const ably = new Ably.Rest(apiKey);

  const tokenRequest = await ably.auth.createTokenRequest({
    clientId,
    capability: JSON.stringify({ [channelName]: ["subscribe", "publish"] }),
  });

  console.log(`Ably token created for channel=${channelName} clientId=${clientId}`);
  console.log("capability:", JSON.stringify({ [channelName]: ["subscribe", "publish"] }));

  return tokenRequest;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userA = url.searchParams.get("userA");
    const userB = url.searchParams.get("userB");
    const clientId = url.searchParams.get("clientId");

    if (!userA || !userB || !clientId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const tokenRequest = await createToken(userA, userB, clientId);
    return NextResponse.json(tokenRequest, { status: 200 });
  } catch (err: any) {
    if (err instanceof Response) return err;
    console.error("Ably token GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {
      // ignore parse errors, fall back to query
    }

    const url = new URL(req.url);
    const userA = body.userA ?? url.searchParams.get("userA");
    const userB = body.userB ?? url.searchParams.get("userB");
    const clientId = body.clientId ?? url.searchParams.get("clientId");

    if (!userA || !userB || !clientId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const tokenRequest = await createToken(userA, userB, clientId);
    return NextResponse.json(tokenRequest, { status: 200 });
  } catch (err: any) {
    if (err instanceof Response) return err;
    console.error("Ably token POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
