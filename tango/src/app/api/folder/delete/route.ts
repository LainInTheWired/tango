import {  NextRequest } from 'next/server'
import { PrismaClient } from "@prisma/client";
import prisma from '@/lib/prismadb';

export async function POST(req: NextRequest) {
    const body = await req.json()
    console.log(body)
    const getWords = await prisma.folder.delete({
        where: {
            id: body.id,
        }
    })
    return new Response(JSON.stringify({ message:"deleted word"}))
}