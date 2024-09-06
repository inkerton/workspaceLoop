import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/mongodb';
import User from "../../../model/User";
import argon2 from 'argon2';

export async function POST(request) {
    await dbConnect();
    const { username, password, email, role } = await request.json();

    try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return NextResponse.json({ message: 'User already exists' }, { status: 200 });
            }
            const hashedPassword = await argon2.hash(password);
            const newUser = new User({ username, password: hashedPassword, email, role });

            await newUser.save();
            return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
       
    } catch (error) {
        return NextResponse.json({ message: "Error while registering user." }, { status: 500 });
    }
}


export async function GET(request){
    try {
        const users = await User.find();
        const options = users.map(user => user.username);
    
        if (!users) {
          return NextResponse.json({message: "No users present"}, {status: 500});  
        } 
        
        return NextResponse.json({data: options}, {status: 200});
      } catch(error) {
        console.log(error)
        return NextResponse.json({message: "Error while getting incidents"}, {status: 500});
      }
}