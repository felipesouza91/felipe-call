import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Date not provided' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())
  if (isPastDate) {
    return res.json({ availability: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })
  if (!userAvailability) {
    return res.json({ availableTime: [] })
  }
  const { time_start_in_minutes, time_end_in_minutes } = userAvailability
  const startHours = time_start_in_minutes / 60
  const endHours = time_end_in_minutes / 60
  const possibleTime = Array.from({ length: endHours - startHours }).map(
    (_, index) => startHours + index,
  )
  const blockedTimes = await prisma.scheduling.findMany({
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHours).toDate(),
        lte: referenceDate.set('hour', endHours).toDate(),
      },
    },
  })
  const availableTime = possibleTime.map((hour) => {
    return {
      hour,
      available: !blockedTimes.some(
        (blockedTime) => blockedTime.date.getHours() === hour,
      ),
    }
  })

  return res.status(200).json({ availableTime })
}
