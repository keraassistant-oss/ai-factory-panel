// Types for the AI Factory Panel

export type Stage = 
  | 'INTAKE'
  | 'DECOMPOSITION'
  | 'DESIGN'
  | 'ARCHITECTURE'
  | 'DEV'
  | 'QA'
  | 'DELIVERY'

export type Status = 'ACTIVE' | 'COMPLETED' | 'PAUSED'

export type StageStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ProjectWithStages {
  id: string
  name: string
  description: string | null
  tzContent: string | null
  currentStage: Stage
  status: Status
  githubRepo: string | null
  githubUrl: string | null
  createdAt: Date
  updatedAt: Date
  stages: ProjectStageWithArtifacts[]
}

export interface ProjectStageWithArtifacts {
  id: string
  projectId: string
  stage: Stage
  status: StageStatus
  comment: string | null
  approvedAt: Date | null
  createdAt: Date
  artifacts: Artifact[]
}

export interface Artifact {
  id: string
  stageId: string
  type: string
  content: string | null
  url: string | null
  createdAt: Date
}

export const STAGES: Stage[] = [
  'INTAKE',
  'DECOMPOSITION',
  'DESIGN',
  'ARCHITECTURE',
  'DEV',
  'QA',
  'DELIVERY',
]

export const STAGE_LABELS: Record<Stage, string> = {
  INTAKE: 'Приём',
  DECOMPOSITION: 'Декомпозиция',
  DESIGN: 'Дизайн',
  ARCHITECTURE: 'Архитектура',
  DEV: 'Разработка',
  QA: 'Тестирование',
  DELIVERY: 'Доставка',
}

export const STATUS_LABELS: Record<Status, string> = {
  ACTIVE: 'Активен',
  COMPLETED: 'Завершён',
  PAUSED: 'На паузе',
}

export const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  PENDING: 'Ожидает',
  APPROVED: 'Апрувнут',
  REJECTED: 'Отклонён',
}
