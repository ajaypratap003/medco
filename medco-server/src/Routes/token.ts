import { Router } from "express";
import AuthController from "../controller/authController";

const router = Router();

router.post("/get", AuthController.getToken);
router.post("/verify", AuthController.verifyToken);

export default router;
