import { Router } from "express";
import * as usersController from "./../controllers/users.controller.js";

const router = Router();

router.get("/me", usersController.me);

export default router;
