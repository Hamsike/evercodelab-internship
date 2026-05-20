import router from "./status";
import { Router } from "express";

const routerRoot = Router()

routerRoot.use(router)

export default routerRoot