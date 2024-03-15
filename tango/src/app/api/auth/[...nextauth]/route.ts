import options from '@/lib/next-auth/authOptions'
import NextAuth from 'next-auth/next'


const handler = NextAuth(options)

export {
  handler as GET,
  handler as POST
}