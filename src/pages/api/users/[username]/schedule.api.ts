import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'
import * as zod from 'zod'

import type { NextApiRequest, NextApiResponse } from 'next'
import dayjs from 'dayjs'
import { getGoogleOauthToken } from '@/lib/google'

const scheduleInputData = zod.object({
  name: zod.string(),
  email: zod.string().email(),
  observation: zod.string().nullable(),
  date: zod.string().datetime(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }
  try {
    const { date, email, name, observation } = scheduleInputData.parse(req.body)

    const scheduleDate = dayjs(date).startOf('hour')

    if (scheduleDate.isBefore(new Date())) {
      return res.status(400).json({ message: 'Date is in the past' })
    }
    const isScheduleAvailable = await prisma.scheduling.findFirst({
      where: {
        user_id: user.id,
        date: scheduleDate.toDate(),
      },
    })

    if (isScheduleAvailable) {
      return res.status(400).json({ message: 'Schedule is not available' })
    }

    const schedule = await prisma.scheduling.create({
      data: {
        date,
        email,
        name,
        observation,
        user_id: user.id,
      },
    })

    const calendar = google.calendar({
      version: 'v3',
      auth: await getGoogleOauthToken(user.id),
    })

    const { data } = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: `Felipe-Call: ${name}`,
        description: observation,
        start: {
          dateTime: scheduleDate.format(),
        },
        end: {
          dateTime: scheduleDate.endOf('hour').format(),
        },
        attendees: [{ email, displayName: name }],
        conferenceData: {
          createRequest: {
            requestId: schedule.id,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      },
    })
    console.log(data)
    return res.status(201).end()
  } catch (error: any) {
    console.log(error)
    return res.status(400).json({ message: 'Error' })
  }
}
