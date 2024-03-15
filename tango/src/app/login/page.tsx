'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import type { FormEvent } from 'react'
import React from 'react'

const LoginPage = () => {
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)

    const email = data.get('email')
    const password = data.get('password')

    await signIn('credentials', {
      redirect: false,
      email: email,
      password,
    })
      .then((res) => {
        if (res?.error) {
          alert(res.error)
        }
        router.push('/')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
    </>
  )
}

export default LoginPage
