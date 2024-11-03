import { createThread } from "@/services/chatbot";
import { NextApiRequest, NextApiResponse } from "next";

type Response = {
    message: string;
    data?: any;
    error?: any;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    if(req.method === "POST"){
        const ress = await createThread();
        return res.status(200).json({
            message: "Thread created",
            data: ress
        })
    }else{
        return res.status(405).json({
            message: "Method not allowed"
        })
    }
}