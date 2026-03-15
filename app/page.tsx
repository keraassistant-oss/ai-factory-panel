import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, ArrowRight, Github } from 'lucide-react'
import { STAGE_LABELS, STATUS_LABELS, Stage, Status } from '@/lib/types'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Проекты</h1>
          <p className="text-zinc-400 mt-1">Управление AI-разработкой</p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Создать проект
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="py-12 text-center">
            <p className="text-zinc-500">Пока нет проектов. Создайте первый!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="border-zinc-800 bg-zinc-900 hover:border-purple-500/50 transition-colors cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-zinc-100 group-hover:text-purple-400 transition-colors">
                      {project.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-zinc-300 transition-colors"
                          title="Открыть на GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
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
                        {STATUS_LABELS[project.status as Status]}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-zinc-500 mt-2 line-clamp-2">
                    {project.description || 'Нет описания'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Этап:</span>
                      <span className="text-purple-400">
                        {STAGE_LABELS[project.currentStage as Stage]}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <p className="text-xs text-zinc-600 mt-3">
                    Создан: {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
