
import OpenAI from "openai";
import { Messages } from "openai/resources/beta/threads/messages.mjs";

const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAPI_KEY,
});

const assistantId = process.env.NEXT_ASSISTANT_ID as string;

let pollingInterval: NodeJS.Timeout;

async function addMessage(threadId: string, message: string) {
    const response = await openai.beta.threads.messages.create(
        threadId,
        {
            role: "user",
            content: message
        }
    );
    return response;    
}

async function runAssistant(threadId: string) {
    const response = await openai.beta.threads.runs.create(
        threadId,
        {
            assistant_id: assistantId
        }
      );
    return response;
}

async function checkingStatus(threadId: string, runId: string, res: any) {
    const runObject = await openai.beta.threads.runs.retrieve(
        threadId,
        runId
    );
    
    const status = runObject.status;
    console.log(runObject)
    console.log('Current status: ' + status);

    if(status == 'completed') {
        clearInterval(pollingInterval);
        res.json({ message: 'Success' });
    }
}


export const createThread = async () => {
   const thread = await openai.beta.threads.create();
    return thread;
}

export const sendMessage = async (message: string, threadId: string, res: any) => {
    addMessage(threadId, message).then((message) => {
        runAssistant(threadId).then((response) => {
            const ressId = response.id;

            pollingInterval = setInterval(() => {
                checkingStatus(threadId,  ressId, res);
            }, 5000);
        });
    });
}

export const getMessages = async (threadId: string) => {
    const messages = await openai.beta.threads.messages.list(threadId, {
        order: "asc",
        limit: 100
    });
    return messages;
}



