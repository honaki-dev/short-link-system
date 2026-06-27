import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.model.js";
import SessionModel from "../models/Session.model.js";

const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

export const register = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name } = req.body;
        if (!username || !email || !password || !first_name || !last_name) {
            return res.status(400).json({
                error: "Invalid request body",
            });
        }

        const duplicate = await UserModel.findOne({ username });
        if (duplicate) {
            return res.status(409).json({
                error: "Username already exist",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            username,
            email,
            hashedPassword,
            firstName: first_name,
            lastName: last_name,
        });

        return res.sendStatus(204);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: "Missing username or password",
            });
        }

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(401).json({
                error: "Invalid username or password",
            });
        }

        const isCorrectPassword = await bcrypt.compare(
            password,
            user.hashedPassword,
        );

        if (!isCorrectPassword) {
            return res.status(401).json({
                error: "Invalid username or password",
            });
        }

        const accessToken = jwt.sign(
            {
                userId: user._id,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_TTL },
        );

        const refreshToken = crypto.randomBytes(64).toString("hex");

        await SessionModel.create({
            refreshToken,
            userId: user._id,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: REFRESH_TOKEN_TTL,
        });

        return res.json({
            message: "Logged in successfully",
            access_token: accessToken,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refresh_token;

        if (refreshToken) {
            await SessionModel.deleteOne({ refreshToken });
            res.clearCookie("refresh_token");
        }

        return res.sendStatus(204);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refresh_token;
        console.log(refreshToken);

        const session = await SessionModel.findOne({ refreshToken });

        if (session) {
            if (session.expiresAt < new Date()) {
                return res.status(403).json({
                    error: "Token was expired",
                });
            }
            const accessToken = jwt.sign(
                {
                    userId: session.userId,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_TTL },
            );
            return res.json({
                access_token: accessToken,
            });
        }

        return res.status(401).json({ error: "Invalid token" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
};
