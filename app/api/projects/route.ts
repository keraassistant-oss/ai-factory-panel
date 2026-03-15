import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { STAGES } from '@/lib/types'
import { createGithubRepo } from '@/lib/github'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    include: {
      stages: {
        include: {
          artifacts: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, description, tzContent } = body

  // Create GitHub repository first (don't fail if it doesn't work)
  let githubRepo: string | null = null
  let githubUrl: string | null = null
  
  try {
    const repoResult = await createGithubRepo(name, description)
    if (repoResult) {
      githubRepo = repoResult.repoName
      githubUrl = repoResult.repoUrl
    }
  } catch (error) {
    console.error('Failed to create GitHub repo:', error)
    // Continue without GitHub repo
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      tzContent,
      githubRepo,
      githubUrl,
    },
  })

  // Create all stages for the project
  await prisma.projectStage.createMany({
    data: STAGES.map((stage) => ({
      projectId: project.id,
      stage,
    })),
  })

  return NextResponse.json(project, { status: 201 })
}
