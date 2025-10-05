import { Request, Response } from "express";
import User from "../models/User";
//find user by user_id
export const findUserById = async (req:Request, res:Response) =>{
    try {
        const {userId} = req.params;
        const user = await User.findOne({user_id : userId});
        res.status(201).json(user);
    } catch (error) {
        res.status(404).json({message:"User not found"});
    }
}