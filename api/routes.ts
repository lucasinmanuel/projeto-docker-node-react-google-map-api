import { Router } from "express";
import { rideConfirm, rideEstimate, rideHistory } from "./controllers/ride.js";
import staticMap from "./controllers/staticMap.js";
import driver from "./controllers/driver.js";

const router = Router();

router.get('/ride/:customer_id', rideHistory as any);
router.get('/drivers', driver as any);

router.post('/static/map', staticMap as any)
router.post('/ride/estimate', rideEstimate as any);

router.patch('/ride/confirm', rideConfirm as any);

export default router;