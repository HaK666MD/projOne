import { Request } from "express";
import { UserEntity } from "../entity/user.entity";

export interface ExpressReqInterface extends Request {
  user?: UserEntity
}