import { connect, disconnect } from "@/app/db/connection";
import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";
// { userA : {ID:"", name:""}}

async function writeToDB(
  userA: any,
  userB: any,
  collection: any,
  statusA: string,
  statusB: string,
) {
  await collection.bulkWrite([
    {
      updateOne: {
        filter: { _id: new ObjectId(userA.ID) },
        update: {
          $set: {
            [`status.${userB.ID}`]: [userB.name, statusA],
          },
        },
      },
    },
    {
      updateOne: {
        filter: { _id: new ObjectId(userB.ID) },
        update: { $set: { [`status.${userA.ID}`]: [userA.name, statusB] } },
      },
    },
  ]);
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { data: "GET successful", status: 200 },
    { status: 200 },
  );
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { userA, userB, statusRequest } = await req.json();
    console.log("Received status update request:", {
      userA,
      userB,
      statusRequest,
    });
    const db = await connect();
    const collection = db.collection("userDetails");

    if (statusRequest === "request") {
      await writeToDB(userA, userB, collection, "request", "requested");
    } else if (statusRequest === "accept") {
      await writeToDB(userA, userB, collection, "accepted", "accepted");
    } else if (statusRequest === "reject") {
      await writeToDB(userA, userB, collection, "rejected", "rejected");
    } else {
      return NextResponse.json(
        { msg: "Invalid status request", status: 400 },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        msg: "User Status Updated Successfully !!",
        status: 200,
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
