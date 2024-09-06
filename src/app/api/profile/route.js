import User from "@/model/User";
import dbConnect from "@/utils/mongodb";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function GET(request) {
  dbConnect();
  try {
    console.log("object");
    const { searchParams } = request.nextUrl;
    const username = searchParams.get("username");
    console.log(username);

    const user = await User.findOne({ username });
    console.log(user);

    const { password } = user;

    return NextResponse.json({ password }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error while getting password" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  dbConnect();
  try {
    console.log("object inside post pass try");
    const body = await request.json();
    const { username, newPassword } = body;
    console.log("object of newpassword", newPassword);

    const user = await User.findOne({ username });
    console.log(user);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();
    return NextResponse.json(
      { message: "Password updated sucessfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An Error occured while updating password" },
      { status: 500 }
    );
  }
}
