'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Artifact } from '@/lib/types'
import { Plus, Link, FileText, X } from 'lucide-react'

type ArtifactType = 'TEXT' | 'URL'

interface ArtifactsProps {
  stageId: string
  projectId: string
  artifacts: Artifact[]
  onUpdate: () => void
}

export function Artifacts({ stageId, projectId, artifacts, onUpdate }: ArtifactsProps) {
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<ArtifactType>('TEXT')
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (type === 'TEXT' && !content.trim()) return
    if (type === 'URL' && !url.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/stages/${stageId}/artifacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          content: type === 'TEXT' ? content : null,
          url: type === 'URL' ? url : null,
        }),
      })
      if (res.ok) {
        setShowForm(false)
        setContent('')
        setUrl('')
        onUpdate()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-zinc-300">Артефакты</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="text-purple-400 hover:text-purple-300"
        >
          <Plus className="w-4 h-4 mr-1" />
          Добавить
        </Button>
      </div>

      {showForm && (
        <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 space-y-3">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={type === 'TEXT' ? 'default' : 'outline'}
              onClick={() => setType('TEXT')}
              className={type !== 'TEXT' ? 'border-zinc-700' : ''}
            >
              <FileText className="w-4 h-4 mr-1" />
              Текст
            </Button>
            <Button
              type="button"
              size="sm"
              variant={type === 'URL' ? 'default' : 'outline'}
              onClick={() => setType('URL')}
              className={type !== 'URL' ? 'border-zinc-700' : ''}
            >
              <Link className="w-4 h-4 mr-1" />
              Ссылка
            </Button>
          </div>

          {type === 'TEXT' ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Текст артефакта..."
              className="bg-zinc-950 border-zinc-800"
              rows={3}
            />
          ) : (
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="bg-zinc-950 border-zinc-800"
            />
          )}

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={loading || (type === 'TEXT' ? !content.trim() : !url.trim())}
            >
              Сохранить
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setContent('')
                setUrl('')
              }}
              className="border-zinc-700"
            >
              Отмена
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {artifacts.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">Нет артефактов</p>
        ) : (
          artifacts.map((artifact) => (
            <div
              key={artifact.id}
              className="p-3 border border-zinc-800 rounded-lg bg-zinc-900/30"
            >
              {artifact.type === 'URL' ? (
                <a
                  href={artifact.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-sm break-all"
                >
                  <Link className="w-4 h-4 inline mr-2" />
                  {artifact.url}
                </a>
              ) : (
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{artifact.content}</p>
              )}
              <p className="text-xs text-zinc-600 mt-2">
                {new Date(artifact.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
