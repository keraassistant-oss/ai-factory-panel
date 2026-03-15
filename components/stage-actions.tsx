'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StageStatus } from '@/lib/types'
import { Check, X } from 'lucide-react'

interface StageActionsProps {
  stageId: string
  projectId: string
  currentStatus: StageStatus
  onUpdate: () => void
}

export function StageActions({ stageId, projectId, currentStatus, onUpdate }: StageActionsProps) {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/stages/${stageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      })
      if (res.ok) {
        onUpdate()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!comment.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/stages/${stageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', comment }),
      })
      if (res.ok) {
        setShowRejectForm(false)
        setComment('')
        onUpdate()
      }
    } finally {
      setLoading(false)
    }
  }

  if (currentStatus !== 'PENDING') {
    return null
  }

  return (
    <div className="space-y-4">
      {!showRejectForm ? (
        <div className="flex gap-3">
          <Button
            onClick={handleApprove}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Апрув ✅
          </Button>
          <Button
            onClick={() => setShowRejectForm(true)}
            disabled={loading}
            variant="destructive"
          >
            <X className="w-4 h-4 mr-2" />
            Отклонить ❌
          </Button>
        </div>
      ) : (
        <div className="space-y-3 p-4 border border-red-800/50 rounded-lg bg-red-950/20">
          <p className="text-sm text-red-400">Укажите причину отклонения:</p>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Комментарий..."
            className="bg-zinc-900 border-zinc-700"
          />
          <div className="flex gap-3">
            <Button
              onClick={handleReject}
              disabled={loading || !comment.trim()}
              variant="destructive"
              size="sm"
            >
              Подтвердить отклонение
            </Button>
            <Button
              onClick={() => {
                setShowRejectForm(false)
                setComment('')
              }}
              variant="outline"
              size="sm"
              className="border-zinc-700"
            >
              Отмена
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
