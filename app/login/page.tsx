'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import Cookies from 'js-cookie'

const Page = ({}) => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const userData = localStorage.getItem(id)

    if (userData) {
      const { password: storedPassword } = JSON.parse(userData)

      if (storedPassword === password) {
        Cookies.set('user', id, { expires: 1 })
        router.push('/cars')
      } else {
        setError('Неверный пароль.')
      }
    } else {
      setError('Пользователь не найден.')
    }
  }

  if (Cookies.get('user')) {
    return redirect('/cars')
  }

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-[400px] w-full p-4 flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Авторизация</h1>
        {error && <p className="text-red-500">{error}</p>}
        <Label htmlFor="id">Логин пользователя</Label>
        <Input
          placeholder="Логин пользователя"
          type="text"
          id="id"
          value={id}
          onChange={e => setId(e.target.value)}
        />
        <Label htmlFor="password">Пароль</Label>
        <Input
          placeholder="Пароль"
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button type="submit" className="w-full cursor-pointer">
            Войти
          </Button>
          <Link href="/registration" className="w-full">
            <Button className="w-full cursor-pointer">Регистроваться</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Page
