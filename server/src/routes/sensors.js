import { Router } from "express";
import { listSensors } from "../controllers/sensorsController.js";

const router = Router();

router.get("/", listSensors);

// router.get('/:id/measurements', …)

export default router;
