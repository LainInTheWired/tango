import {  NextRequest } from 'next/server'
import { PrismaClient } from "@prisma/client";
import prisma from '@/lib/prismadb';

export async function POST(req: NextRequest) {
    const body = await req.json()
    console.log(body)
    const newWord = await prisma.words.create({
        data: {
            WordEN: body.wordEN,
            WordJP: body.wordJP,
            star: false,
            Folder: body.folder,
        }
    })
    return new Response(JSON.stringify({ message: "new word created" }))

}
