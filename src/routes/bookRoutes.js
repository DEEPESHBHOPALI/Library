import { Router } from "express";
import returnBooks from "../controller/bookController.js";
const router = Router()

router.post('/returnBooks', returnBooks)

export default router