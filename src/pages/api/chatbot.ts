import { getMessages, sendMessage } from "@/services/chatbot";
import { NextApiRequest, NextApiResponse } from "next";

type Response = {
    message: string;
    data?: any;
    error?: any;
}

type Message = {
    'content': string;
    'role': string;
}





export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    if(req.method === "POST"){
        const { message, threadId } = req.body;
        if(!message || !threadId){
            return res.status(400).json({
                message: "Bad request",
                error: "message and threadId are required"
            })
        }
        console.log(message, threadId)
        const response = await sendMessage(message, threadId as string, res);
        return response;
    } else if(req.method === "GET"){
        // get params
        const { threadId } = req.query;
        if(!threadId){
            return res.status(400).json({
                message: "Bad request",
                error: "threadId is required"
            })
        }
        const ress = await getMessages(threadId as string);
        const messages = ress.data;
        // ubah menjadi map yang berisi content dan role
        const data = messages.map((message: any) => {
            return {
                message: message.content[0].text.value,
                role: message.role
            }
        })
        return res.status(200).json({
            message: "Messages retrieved",
            data: data
        })
    }
    return res.status(405).json({
        message: "Method not allowed"
    })
}