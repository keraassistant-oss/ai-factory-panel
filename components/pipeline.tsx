'use client'

import { Stage, StageStatus, STAGES, STAGE_LABELS, STAGE_STATUS_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check, X, Clock } from 'lucide-react'

interface PipelineProps {
  currentStage: Stage
  stages: { stage: Stage; status: StageStatus }[]
}

const stageIcons = {
  PENDING: Clock,
  APPROVED: Check,
  REJECTED: X,
}

const stageColors = {
  PENDING: 'text-zinc-500 border-zinc-700 bg-zinc-900',
  APPROVED: 'text-green-400 border-green-500 bg-green-950',
  REJECTED: 'text-red-400 border-red-500 bg-red-950',
}

export function Pipeline({ currentStage, stages }: PipelineProps) {
  const currentIndex = STAGES.indexOf(currentStage)

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max py-4">
        {STAGES.map((stage, index) => {
          const stageData = stages.find((s) => s.stage === stage)
          const status = stageData?.status || 'PENDING'
          const isActive = index === currentIndex
          const isPast = index < currentIndex
          const Icon = stageIcons[status]

          return (
            <div key={stage} className="flex items-center">
              <div
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                  isActive && 'ring-2 ring-purple-500 ring-offset-2 ring-offset-zinc-950',
                  stageColors[status]
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center border-2',
                      isPast && 'bg-green-500/20 border-green-500',
                      isActive && 'bg-purple-500/20 border-purple-500',
                      !isPast && !isActive && 'bg-zinc-800 border-zinc-700'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium whitespace-nowrap">
                    {STAGE_LABELS[stage]}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {STAGE_STATUS_LABELS[status]}
                  </p>
                </div>
              </div>
              {index < STAGES.length - 1 && (
                <div
                  className={cn(
                    'w-8 h-0.5 mx-1',
                    isPast ? 'bg-green-500' : 'bg-zinc-800'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
