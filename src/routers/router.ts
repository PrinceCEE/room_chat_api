import { Router } from "express";

export default abstract class {
  abstract path: string;
  protected router: Router = Router();
  abstract init(): Router;
}