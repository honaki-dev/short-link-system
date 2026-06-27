import jwt from "jsonwebtoken";
import UserModel from "../models/User.model.js";

export default async function (req, res, next) {
    try {
        const authorization = req.headers.authorization;
        const token = authorization && authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await UserModel.findById(decoded.userId)
            .select("-hashedPassword")
            .lean();

        if (!user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Your token was expired" });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }
        console.error(err);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
}
