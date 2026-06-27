import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./configs/database.js";

import authRoute from "./routes/auth.route.js";
import linksRoute from "./routes/links.route.js";
import gotoRoute from "./routes/goto.route.js";
import usersRoute from "./routes/users.route.js";
import authMiddleware from "./middlewares/auth.middleware.js";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/goto", gotoRoute);
app.use("/api/auth", authRoute);

app.use(authMiddleware);
app.use("/api/users", usersRoute);
app.use("/api/links", linksRoute);

app.listen(PORT, async () => {
    await connectDB();
    console.log("[Server] Started at port:", PORT);
});
