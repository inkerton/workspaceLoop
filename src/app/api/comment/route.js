import dbConnect from "@/utils/mongodb";
import Comment from "@/model/Comment";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  console.log("connected");

  try {
    const { incidentNo, comment } = await request.json();
    console.log("object", incidentNo);
    console.log("object", comment);

    const existingComment = await Comment.findOne({ incidentNo });
    console.log("existing comment", existingComment);

    if (!existingComment) {
      console.log("object not found");
      const newComment = new Comment({
        incidentNo: incidentNo,
        comments: {
          username: comment.username,
          text: comment.text,
          date: comment.date,
        },
      });

      await newComment.save();
      console.log("comment saved -----------");
      return NextResponse.json(
        { message: "Comment Saved!!!" },
        { status: 200 }
      );
    } else {
      console.log("object found");
      existingComment.comments.push({
        username: comment.username,
        text: comment.text,
        date: comment.date,
      });

      await existingComment.save();
      console.log("object updated as new entry pushed");
      return NextResponse.json({ message: "Comment Updated" }, { status: 201 });
    }
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "No incident present" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const incidentNo = url.searchParams.get("incidentNo");
    console.log('object', incidentNo);

    if (!incidentNo) {
        return new Response(JSON.stringify({ message: 'Incident number is required' }), { status: 400 });
      }

    const comment = await Comment.findOne({ incidentNo });
    console.log('object comm', comment);

    if (!comment) {
        return new Response(JSON.stringify({ message: 'Comments not found' }), { status: 404 });
      }

    return NextResponse.json(comment, { status: 200 });

  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "No incident present" },
      { status: 500 }
    );
  }
}
