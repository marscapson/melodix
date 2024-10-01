import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    invitedBy: { type: mongoose.Types.ObjectId, ref: "users" },
    tgUserId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    username: { type: String },
    language: { type: String, required: true },
    photoUrl: { type: String },

    friends: { type: Number, required: true },
    coinsByFriends: { type: Number, required: true },

    coins: { type: Number, required: true },
    currency: { type: String, required: true },

    status: { type: String, required: true }, // active or banned
    dateTime: { type: String, required: true } // created Date and time in UTC format
})

const users = mongoose.model("users", userSchema)

export default users