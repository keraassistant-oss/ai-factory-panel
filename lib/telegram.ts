import { Stage } from './types'

// Маппинг этапов для Telegram уведомлений
export const TELEGRAM_STAGE_LABELS: Record<Stage, string> = {
  INTAKE: 'Анализ ТЗ',
  DECOMPOSITION: 'Декомпозиция',
  DESIGN: 'Дизайн',
  ARCHITECTURE: 'Архитектура',
  DEV: 'Разработка',
  QA: 'Тестирование',
  DELIVERY: 'Деплой',
}

// Порядок этапов для определения следующего
const STAGES_ORDER: Stage[] = [
  'INTAKE',
  'DECOMPOSITION',
  'DESIGN',
  'ARCHITECTURE',
  'DEV',
  'QA',
  'DELIVERY',
]

// Получить label следующего этапа или null если это последний
export function getNextStageLabel(currentStage: Stage): string | null {
  const currentIndex = STAGES_ORDER.indexOf(currentStage)
  if (currentIndex < STAGES_ORDER.length - 1) {
    const nextStage = STAGES_ORDER[currentIndex + 1]
    return TELEGRAM_STAGE_LABELS[nextStage]
  }
  return null
}

// Отправить сообщение через Telegram Bot API
export async function sendTelegramMessage(text: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_OWNER_CHAT_ID

  if (!botToken || !chatId) {
    console.warn('[Telegram] Missing bot token or chat ID')
    return
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('[Telegram] Failed to send message:', error)
      return
    }

    console.log('[Telegram] Message sent successfully')
  } catch (error) {
    console.error('[Telegram] Error sending message:', error)
  }
}

// Форматировать сообщение об апруве этапа
export function formatStageApprovedMessage(
  projectName: string,
  stage: Stage,
  projectId: string,
  nextStageLabel: string | null
): string {
  const stageLabel = TELEGRAM_STAGE_LABELS[stage]
  const nextStageText = nextStageLabel || 'Проект завершён!'
  const projectUrl = `http://192.168.31.158:3000/projects/${projectId}`

  return `🏭 <b>AI Factory</b>

✅ <b>Этап апрувнут!</b>

Проект: ${projectName}
Этап: ${stageLabel}
Следующий этап: ${nextStageText}

🔗 <a href="${projectUrl}">Открыть проект</a>`
}

// Форматировать сообщение об отклонении этапа
export function formatStageRejectedMessage(
  projectName: string,
  stage: Stage,
  projectId: string,
  comment?: string | null
): string {
  const stageLabel = TELEGRAM_STAGE_LABELS[stage]
  const projectUrl = `http://192.168.31.158:3000/projects/${projectId}`

  let message = `🏭 <b>AI Factory</b>

❌ <b>Этап отклонён</b>

Проект: ${projectName}
Этап: ${stageLabel}`

  if (comment) {
    message += `\nКомментарий: ${comment}`
  }

  message += `\n\n🔗 <a href="${projectUrl}">Открыть проект</a>`

  return message
}
