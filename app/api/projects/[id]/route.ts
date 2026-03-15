import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { STAGES } from '@/lib/types'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      stages: {
        include: {
          artifacts: true,
        },
        orderBy: {
          stage: 'asc',
        },
      },
    },
  })

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  return NextResponse.json(project)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { currentStage, status } = body

  const updateData: any = {}
  if (currentStage) updateData.currentStage = currentStage
  if (status) updateData.status = status

  const project = await prisma.project.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(project)
}
