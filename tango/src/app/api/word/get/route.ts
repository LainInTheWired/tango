import {  NextRequest } from 'next/server'
import { PrismaClient } from "@prisma/client";
import prisma from '@/lib/prismadb';

export async function POST(req: NextRequest) {
    const body = await req.json()
    console.log(body)
    const getWords = await prisma.words.findMany({
        where: {
            Folder: body.folder,
        }
    })
    return new Response(JSON.stringify(getWords))
}
