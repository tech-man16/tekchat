import { connect, disconnect } from "@/app/db/connection";
import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    return NextResponse.json(
        { success: true, message: "GET successful", status:200 },
        { status: 200 }
    );
}

export async function POST(req: NextRequest) {
    let db;

    try {
        const body = await req.json();
        const { userA, userB, msg } = body;

        // ✅ Basic validation
        if (!userA || !userB || !msg) {
            return NextResponse.json(
                { success: false, message: "Missing required fields",status:400 },
                { status: 400 }
            );
        }

        db = await connect();
        const messagesCol = db.collection("Messages");
        const mapCol = db.collection("MsgMap");

        const msgId = new ObjectId();

        // ✅ Get last message only (efficient)
        const lastMessage = await messagesCol
            .find({
                $or: [
                    { sent: userA, received: userB },
                    { sent: userB, received: userA },
                ],
            })
            .sort({ timestamp: -1 })
            .limit(1)
            .toArray();

        const newMessage = {
            msg,
            sent: userA,
            received: userB,
            timestamp: new Date(),
            msgId,
        };

        await messagesCol.insertOne(newMessage);

        if (lastMessage.length === 0) {
            // ✅ First message
            await mapCol.insertOne({
                msgId,
                prevID: null,
                nextID: null,
            });
        } else {
            const prevMsgId = lastMessage[0].msgId;

            await mapCol.insertOne({
                msgId,
                prevID: prevMsgId,
                nextID: null,
            });

            await mapCol.updateOne(
                { msgId: prevMsgId },
                { $set: { nextID: msgId } }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Message stored successfully",
                data: newMessage,
                status:201
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("POST error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
                error: error.message,
                status:500
            },
            { status: 500 }
        );
    } finally {
        if (db) await disconnect();
    }
}