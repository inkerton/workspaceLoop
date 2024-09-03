import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: Buffer,
        required: true,
    },    
    email: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
    },    
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model("User",userSchema)

export default User;