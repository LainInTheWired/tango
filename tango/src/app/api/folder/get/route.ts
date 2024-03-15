import {  NextRequest } from 'next/server'
import { PrismaClient } from "@prisma/client";
import prisma from '@/lib/prismadb';

export async function POST(req: NextRequest) {
    const body = await req.json()
    console.log(body)
    const getWords = await prisma.folder.findMany({
        where: {
            userId: body.userid,
        }
    })
    return new Response(JSON.stringify(getWords))
}