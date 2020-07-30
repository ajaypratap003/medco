import { Router } from "express";
// import auth from "./auth";
import user from "./user";
import token from "./token";

const routes = Router();

// routes.use("/auth", auth);
routes.use("/token", token);
routes.use("/user", user);

export default routes;
