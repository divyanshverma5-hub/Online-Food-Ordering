import express from "express"

import { cityController, detailsController } from "../controllers/landingPageController.js";

const router = express.Router();

router.get("/city/:city", cityController)

router.get("/details", detailsController)

export default router;