'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pipeline } from '@/components/pipeline'
import { StageActions } from '@/components/stage-actions'
import { Artifacts } from '@/components/artifacts'
import { ProjectWithStages, STAGE_LABELS, STATUS_LABELS, STAGES } from '@/lib/types'
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<ProjectWithStages | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const fetchProject = async () => {
    const res = await fetch(`/api/projects/${params.id}`)
    if (res.ok) {
      const data = await res.json()
      setProject(data)
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProject()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-500">Загрузка...</p>
      </div>
    )
  }

  if (!project) return null

  const currentStageData = project.stages.find(
    (s) => s.stage === project.currentStage
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="pl-0 text-zinc-400 hover:text-zinc-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </Link>
        <Badge
          variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}
          className={
            project.status === 'ACTIVE'
              ? 'bg-green-600/20 text-green-400 border-green-600/30'
              : project.status === 'COMPLETED'
              ? 'bg-blue-600/20 text-blue-400 border-blue-600/30'
              : 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
          }
        >
          {STATUS_LABELS[project.status]}
        </Badge>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-zinc-100">{project.name}</h1>
        <p className="text-zinc-400 mt-2">{project.description || 'Нет описания'}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
            Обзор
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="data-[state=active]:bg-purple-600">
            Воронка
          </TabsTrigger>
          <TabsTrigger value="tz" className="data-[state=active]:bg-purple-600">
            ТЗ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-100">Текущий этап</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-zinc-100">
                    {STAGE_LABELS[project.currentStage]}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Статус: {currentStageData?.status === 'PENDING' ? 'Ожидает проверки' : 
                      currentStageData?.status === 'APPROVED' ? 'Апрувнут' : 'Отклонён'}
                  </p>
                </div>
              </div>

              {currentStageData && currentStageData.status === 'PENDING' && (
                <StageActions
                  stageId={currentStageData.id}
                  projectId={project.id}
                  currentStatus={currentStageData.status}
                  onUpdate={fetchProject}
                />
              )}

              {currentStageData?.comment && (
                <div className="p-4 border border-red-800/50 rounded-lg bg-red-950/20">
                  <p className="text-sm text-red-400 font-medium">Причина отклонения:</p>
                  <p className="text-sm text-zinc-300 mt-1">{currentStageData.comment}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-100">История</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.stages
                  .filter((s) => s.status !== 'PENDING')
                  .sort((a, b) => new Date(b.approvedAt || 0).getTime() - new Date(a.approvedAt || 0).getTime())
                  .map((stage) => (
                    <div
                      key={stage.id}
                      className="flex items-center gap-3 p-3 border border-zinc-800 rounded-lg"
                    >
                      {stage.status === 'APPROVED' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-200">
                          {STAGE_LABELS[stage.stage]}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {stage.approvedAt
                            ? new Date(stage.approvedAt).toLocaleString('ru-RU')
                            : new Date(stage.createdAt).toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <Badge
                        variant={stage.status === 'APPROVED' ? 'default' : 'destructive'}
                        className={
                          stage.status === 'APPROVED'
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-red-600/20 text-red-400'
                        }
                      >
                        {stage.status === 'APPROVED' ? 'Апрув' : 'Отклонён'}
                      </Badge>
                    </div>
                  ))}
                {project.stages.filter((s) => s.status !== 'PENDING').length === 0 && (
                  <p className="text-sm text-zinc-500 italic">История пуста</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-100">Воронка разработки</CardTitle>
            </CardHeader>
            <CardContent>
              <Pipeline
                currentStage={project.currentStage}
                stages={project.stages.map((s) => ({ stage: s.stage, status: s.status }))}
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-zinc-100">Артефакты по этапам</h3>
            {STAGES.map((stage) => {
              const stageData = project.stages.find((s) => s.stage === stage)
              if (!stageData) return null
              return (
                <Card key={stage} className="border-zinc-800 bg-zinc-900">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base text-zinc-100">
                        {STAGE_LABELS[stage]}
                      </CardTitle>
                      <Badge
                        variant={stageData.status === 'APPROVED' ? 'default' : 'outline'}
                        className={
                          stageData.status === 'APPROVED'
                            ? 'bg-green-600/20 text-green-400 border-green-600/30'
                            : stageData.status === 'REJECTED'
                            ? 'bg-red-600/20 text-red-400 border-red-600/30'
                            : 'border-zinc-700 text-zinc-400'
                        }
                      >
                        {stageData.status === 'APPROVED'
                          ? '✅ Апрув'
                          : stageData.status === 'REJECTED'
                          ? '❌ Отклонён'
                          : '⏳ Ожидает'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Artifacts
                      stageId={stageData.id}
                      projectId={project.id}
                      artifacts={stageData.artifacts}
                      onUpdate={fetchProject}
                    />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="tz">
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-100">Техническое задание</CardTitle>
            </CardHeader>
            <CardContent>
              {project.tzContent ? (
                <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono bg-zinc-950 p-4 rounded-lg">
                  {project.tzContent}
                </pre>
              ) : (
                <p className="text-zinc-500 italic">ТЗ не заполнено</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
