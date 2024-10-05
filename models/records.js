import mongoose from "mongoose"

const recordSchema = mongoose.Schema({
    taskId: { type: mongoose.Types.ObjectId, ref: "tasks", required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    status: { type: String, required: true },
    dateTime: { type: String, required: true }
})

const records = mongoose.model("records", recordSchema)

export default records