import mongoose from "mongoose"

const connectMongoDb = async (req, res) => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_URL);
        console.log("Connected To Database");
    } catch (error) {
        console.log(error);
    }
}

export default connectMongoDb;