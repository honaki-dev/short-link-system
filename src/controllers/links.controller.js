import { nanoid } from "nanoid";
import LinkModel from "../models/Link.model.js";

export const createLink = async (req, res) => {
    try {
        const { shortCode, originalURL } = req.body;
        const url = new URL(originalURL);
        const code = shortCode?.length > 0 ? shortCode : nanoid(10);
        await LinkModel.create({
            shortCode: code,
            originalURL: url.toString(),
            ownerId: req.user._id,
        });
        return res.status(201).json({
            message: "Successfully create a short link",
            data: {
                shortCode: code,
                originalURL,
            },
        });
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(400).json({
                error: "Short code already exist",
            });
        }
        if (err.name === "ERR_INVALID_URL") {
            return res.status(400).json({
                error: "Invalid URL",
            });
        }
        console.error(err);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};

export const getLink = async (req, res) => {
    try {
        const links = await LinkModel.find({ ownerId: req.user._id });
        return res.json({
            data: links,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};
