import routerStatus from "./status.js";
import routerCurrency from "./currency.js";
import routerPrice from "./price.js";
import { Router } from "express";

const routerRoot = Router()

routerRoot.use('/status', routerStatus)
routerRoot.use('/currency', routerCurrency)
routerRoot.use('/price', routerPrice)

export default routerRoot