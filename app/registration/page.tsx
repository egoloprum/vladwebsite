'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

const Page = () => {
  const [username, setUsername] = useState('')
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()

  useEffect(() => {
    if (Cookies.get('user')) {
      router.push('/cars')
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (localStorage.getItem(id)) {
      setError('ID уже существует. Пожалуйста, выберите другой ID.')
      return
    }

    const userData = {
      username,
      id,
      password,
      addedCars: [],
      markedCars: []
    }
    localStorage.setItem(id, JSON.stringify(userData))

    Cookies.set('user', id, { expires: 1 })

    setUsername('')
    setId('')
    setPassword('')
    setError('')

    router.push('/cars')
  }

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-[400px] w-full border-2 p-4 flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Форма регистрации</h1>
        {error && <p className="text-red-500">{error}</p>}
        <Label htmlFor="username">Имя пользователя</Label>
        <Input
          placeholder="username"
          type="text"
          id="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <Label htmlFor="id">Логин пользователя</Label>
        <Input
          placeholder="ID"
          type="text"
          id="id"
          value={id}
          onChange={e => setId(e.target.value)}
        />
        <Label htmlFor="password">Пароль</Label>
        <Input
          placeholder="password"
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type="submit">Регистроваться</Button>
      </form>
    </div>
  )
}

export default Page
