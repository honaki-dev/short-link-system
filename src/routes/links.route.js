import { Router } from "express";
import * as linksController from "./../controllers/links.controller.js";

const router = Router();

router.get("/", linksController.getLink);
router.post("/", linksController.createLink);

export default router;
