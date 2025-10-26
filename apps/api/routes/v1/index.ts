import Router from "express"

import websiteRouter from "./website";


const router = Router();


router.use("/website", websiteRouter)

export default router;