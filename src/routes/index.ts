import routerStatus from "./status.js";
import routerCurrency from "./currency.js";
import { Router } from "express";

const routerRoot = Router()

routerRoot.use('/status', routerStatus)
routerRoot.use('/currency', routerCurrency)

export default routerRoot