import { connect, disconnect } from "@/app/db/connection";
import { ObjectId } from "mongodb";
import next from "next";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    return NextResponse.json({ data: "GET successful", status: 200 }, { status: 200 });
}

export async function POST(req: NextRequest, res: any) {
    try {
        const { userA,userB,msg } = await req.json();
        const db = await connect();
        const collection1 = db.collection('Messages');
        const collection2 = db.collection('MsgMap');
        const data = await collection1.find({ $or: [{ sent: userA, received: userB }, { sent: userB, received: userA }] }).toArray();
        if(data.length===0){
            const msgId=new ObjectId();
            await collection1.insertOne({msg:msg,sent:userA,received:userB,timestamp:new Date(),msgId:msgId});
            await collection2.insertOne({msgId:msgId,prevID:null,nextID:null});
        } else {
            const msgId=new ObjectId();
            await collection1.insertOne({msg:msg,sent:userA,received:userB,timestamp:new Date(),msgId:msgId});
            await collection2.insertOne({msgId:msgId,prevID:data[data.length-1].msgId,nextID:null});
            await collection2.updateOne({msgId:data[data.length-1].msgId},{$set:{nextID:msgId}});
        }
        
        return NextResponse.json({
            msg: "Message stored success!!",
            status: 200,
            data: data
        },
            { status: 200 });
    } catch (e: any) {
        console.log(e)
        return NextResponse.json({ msg: "Internal server error", status: 505, error: e }, { status: 505 });
    } finally {
        await disconnect();
    }
}