import { Request, Response } from "express";

export const welcome = (req: Request, res: Response) => {
    return res.json({ message: "Hallo world" })
}
