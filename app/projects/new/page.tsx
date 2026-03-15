'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProjectPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tzContent, setTzContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, tzContent }),
      })
      if (res.ok) {
        router.push('/')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/">
        <Button variant="ghost" className="pl-0 text-zinc-400 hover:text-zinc-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к проектам
        </Button>
      </Link>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-2xl text-zinc-100">Новый проект</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Название *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Название проекта"
                className="bg-zinc-950 border-zinc-800"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Описание</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Краткое описание проекта"
                className="bg-zinc-950 border-zinc-800"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Техническое задание</label>
              <Textarea
                value={tzContent}
                onChange={(e) => setTzContent(e.target.value)}
                placeholder="Полный текст ТЗ..."
                className="bg-zinc-950 border-zinc-800 font-mono text-sm"
                rows={10}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={loading || !name.trim()}
              >
                {loading ? 'Создание...' : 'Создать проект'}
              </Button>
              <Link href="/">
                <Button type="button" variant="outline" className="border-zinc-700">
                  Отмена
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
