import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Stage, StageStatus } from '@/lib/types'
import {
  sendTelegramMessage,
  formatStageApprovedMessage,
  formatStageRejectedMessage,
  getNextStageLabel,
} from '@/lib/telegram'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; stageId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, stageId } = await params
  const body = await req.json()
  const { status, comment } = body

  const updateData: any = {}
  if (status) {
    updateData.status = status as StageStatus
    if (status === 'APPROVED') {
      updateData.approvedAt = new Date()
    }
  }
  if (comment !== undefined) updateData.comment = comment

  // Get project info for notifications
  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const stage = await prisma.projectStage.update({
    where: {
      id: stageId,
      projectId: id,
    },
    data: updateData,
  })

  // If approved, move project to next stage
  if (status === 'APPROVED') {
    const stages: Stage[] = [
      'INTAKE',
      'DECOMPOSITION',
      'DESIGN',
      'ARCHITECTURE',
      'DEV',
      'QA',
      'DELIVERY',
    ]
    const currentIndex = stages.indexOf(stage.stage as Stage)
    if (currentIndex < stages.length - 1) {
      await prisma.project.update({
        where: { id },
        data: { currentStage: stages[currentIndex + 1] },
      })
    } else {
      // Last stage approved, mark project as completed
      await prisma.project.update({
        where: { id },
        data: { status: 'COMPLETED' },
      })
    }

    // Send Telegram notification for approval
    const nextStageLabel = getNextStageLabel(stage.stage as Stage)
    const approvalMessage = formatStageApprovedMessage(
      project.name,
      stage.stage as Stage,
      id,
      nextStageLabel
    )
    await sendTelegramMessage(approvalMessage)
  }

  // If rejected, send Telegram notification
  if (status === 'REJECTED') {
    const rejectionMessage = formatStageRejectedMessage(
      project.name,
      stage.stage as Stage,
      id,
      comment
    )
    await sendTelegramMessage(rejectionMessage)
  }

  return NextResponse.json(stage)
}
