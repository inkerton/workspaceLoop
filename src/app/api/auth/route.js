import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/mongodb';
import User from "../../../model/User";
// import bcrypt from 'bcrypt';

export async function POST(request) {
    await dbConnect();
    const { action, username, password, email } = await request.json();

    try {
        if (action === 'register') {
            // Register a new user
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return NextResponse.json({ message: 'User already exists' }, { status: 200 });
            }
            // const salt = await bcrypt.genSalt(10);
            // const hashedPassword = await bcrypt.hash(password, salt);
            // Create a new user (password should be hashed in a real application)
            // const newUser = new User({ username, password:hashedPassword, email });
            const newUser = new User({ username, password, email });

            await newUser.save();
            return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
        } 
        
        else if (action === 'login') {
            // Login user
            const user = await User.findOne({ username });

                if (!user) {
                    return NextResponse.json({ message: 'Invalid username or password' }, { status: 404 });
                }
                // const storedPassword = user.password.toString();
                // const isPasswordCorrect = await bcrypt.compare(password, storedPassword);
    
                // if (!isPasswordCorrect) {
                if ( password != user.password) {
                    return NextResponse.json({ message: 'Invalid username or password' }, { status: 404 });
                }
    
                return NextResponse.json({ exists: true }, { status: 200 });
                
            // if (user && isPasswordCorrect) {
            if (user && user.password === password) {
                return NextResponse.json({ exists: true }, { status: 200 });
            } else {
                return NextResponse.json({ exists: false }, { status: 404 });
            }
        } else {
            return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(request){
    try {

    } 
    catch (error) {

    }
}