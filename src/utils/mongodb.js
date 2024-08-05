import mongoose from 'mongoose';

const MONGO_URI  = 'mongodb://localhost:27017/Workspace';

if (!MONGO_URI){
    throw new error ("please define MONGO_URI env variable");
}

async function dbConnect(){
    if(mongoose.connection.readyState !== 1){
        try {
            await mongoose.connect(MONGO_URI);
            console.log('--- DATABASE CONNECTED SUCCESSFULLY! ---');
        } catch (error) {
            console.log(error);
            throw error
        }
    } else {
        console.log("DB is alreeady connected");
    }
}

export default dbConnect;