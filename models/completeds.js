import mongoose from "mongoose"

const completedsSchema = mongoose.Schema({
    taskId: { type: mongoose.Types.ObjectId, ref: "tasks", required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    dateTime: { type: String, required: true }
})

const completeds = mongoose.model("completeds", completedsSchema)

export default completeds