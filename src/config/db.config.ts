import mongoose from "mongoose";
import { serverconfig } from "./server";



export async function connectionDB(){
    try {
        await mongoose.connect(serverconfig.MONGO_URI);
        
        console.log('Connected to MongoDB');

    } catch (error) {
        
         console.error('MongoDB connection error:', error);
    }
}
