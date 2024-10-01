import mongoose from "mongoose"

const walletSchema = mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    wallet: { type: String, required: true },
    service: { type: String, required: true }, // qubic, ton
    dateTime: { type: String, required: true }
})

const wallets = mongoose.model("wallets", walletSchema)

export default wallets