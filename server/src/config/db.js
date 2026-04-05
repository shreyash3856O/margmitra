import mongoose from 'mongoose';
import winston from 'winston';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        winston.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        winston.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
