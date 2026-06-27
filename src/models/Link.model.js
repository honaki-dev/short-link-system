import { model, Schema } from "mongoose";

const linkSchema = new Schema({
    shortCode: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    originalURL: {
        type: String,
        required: true,
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

export default model("Link", linkSchema);
