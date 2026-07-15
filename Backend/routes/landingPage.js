import express from "express"
import pool from "../config/db.js";

import { cityController, detailsController, searchController } from "../controllers/landingPageController.js";

const router = express.Router();

router.get("/city/:city", cityController)

router.get("/details", detailsController)

router.get("/search", searchController)

export default router;