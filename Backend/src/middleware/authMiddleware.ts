import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
export const authMiddleware = (req:Request, res:Response, next: NextFunction) => {
    try {
        const { userId } = getAuth(req);
        if(!userId){
            return res.status(401).send("Unauthorized Access");
        } else {
            (req as any).userId = userId;
            next();
        }
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(500).send("Internal Server Error");
    }
}