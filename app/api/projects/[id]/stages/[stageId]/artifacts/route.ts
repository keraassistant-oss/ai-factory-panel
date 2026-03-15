import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; stageId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { stageId } = await params
  const body = await req.json()
  const { type, content, url } = body

  const artifact = await prisma.artifact.create({
    data: {
      stageId,
      type,
      content,
      url,
    },
  })

  return NextResponse.json(artifact, { status: 201 })
}
