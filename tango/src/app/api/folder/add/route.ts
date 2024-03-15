import {  NextRequest } from 'next/server'
import { PrismaClient } from "@prisma/client";
import prisma from '@/lib/prismadb';

export async function POST(req: NextRequest) {
    const body = await req.json()
    console.log(body)
    const newWord = await prisma.folder.create({
        data: {
            name: body.name,
            userId: 1234,
        }
    })
    return new Response(JSON.stringify({ message: "new folder created" }))

}
