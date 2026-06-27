import { model, Schema } from "mongoose";

const sessionSchema = new Schema({
    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model("Session", sessionSchema);
