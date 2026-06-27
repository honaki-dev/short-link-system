import { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: true,
        },
        lastName: {
            type: String,
            trim: true,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            trim: true,
            required: true,
            lowercase: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            required: true,
            lowercase: true,
        },
        hashedPassword: {
            type: String,
            trim: true,
            required: true,
        },
        verified: {
            type: Boolean,
        },
    },
    {
        timestamps: true,
    },
);

export default model("User", userSchema);
