import router from "./status.js";
import { Router } from "express";

const routerRoot = Router()

routerRoot.use(router)

export default routerRoot