import { connect, disconnect } from "@/app/db/connection";
import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";
export const dynamic = "force-static";
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { data: "GET successful", status: 200 },
    { status: 200 },
  );
}

export async function POST(req: NextRequest, res: any) {
  try {
    const { userA, userB } = await req.json();
    const db = await connect();

    const collection = db.collection("Messages");
    await collection.createIndex({ sent: 1, received: 1, timestamp: -1 });
    // const data = await collection.find({ sent: userA, received: userB }).sort().toArray();
    const data = await collection
      .find({
        $or: [
          { sent: userA, received: userB },
          { sent: userB, received: userA },
        ],
      })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();
    if (data.length === 0) {
      return NextResponse.json(
        {
          msg: "No Conversation Found !!",
          data: [],
          status: 404,
        },
        { status: 404 },
      );
    }
    let messages = [];
    let currentMsgId = data[0].msgId;

    while (currentMsgId) {
      const msgData = await collection.findOne({ msgId: currentMsgId });
      if (msgData) {
        messages.push(msgData);
        const msgMapCollection = db.collection("MsgMap");
        const msgMapData = await msgMapCollection.findOne({
          msgId: currentMsgId,
        });
        currentMsgId = msgMapData != null ? msgMapData.prevID : null;
      } else {
        break;
      }
    }

    messages = messages.reverse();

    return NextResponse.json(
      {
        msg: "Get mail Successfull !!",
        status: 200,
        data: messages,
      },
      { status: 200 },
    );
  } catch (e: any) {
    console.log(e);
    return NextResponse.json(
      { msg: "Internal server error", status: 505, error: e },
      { status: 505 },
    );
  } finally {
    await disconnect();
  }
}
