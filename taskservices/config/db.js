import mongoose from "mongoose";
import dotenv from"dotenv";

dotenv.config();

const DBURL = process.env.DBURL;

let db;

export async function connectDB(){
    if(!db){
        db = await mongoose.connect(DBURL);
    }
    return db;
}