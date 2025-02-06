import mongoose from "mongoose";

let db = "mongodb://localhost:27017/Ferretech"

const connect = async () => {
    try {
        const conn = await mongoose.connect(db)
        console.log("MongoDB connected")
    } catch (error) {
        console.error(error)
    }
}

export default connect