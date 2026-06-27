import { Router } from "express";
import * as gotoController from "./../controllers/goto.controller.js";

const router = Router();

router.get("/:code", gotoController.redirect);

export default router;
