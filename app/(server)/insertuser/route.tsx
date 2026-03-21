import { connect, disconnect } from "@/app/db/connection";
import { ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    return NextResponse.json({ data: "GET successful", status: 200 }, { status: 200 });
}

export async function POST(req: NextRequest, res: any) {
    try {
        const { userId,password } = await req.json();
        const db = await connect();
        const collection = db.collection('userDetails');
        
        const data = await collection.find({ userId: userId ,password:password}).toArray();
        if(data.length===0){
            await collection.insertOne({userId:userId,password:password});
        }

        return NextResponse.json({
            msg: "User Added Successfully !!",
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