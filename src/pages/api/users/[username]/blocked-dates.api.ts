import { prisma } from '@/lib/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { year, month } = req.query
  if (!year || !month) {
    return res.status(400).json({ message: 'Date not provided' })
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

  const availabilityWeeksDay = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(
    (weekDay) =>
      !availabilityWeeksDay.some(
        (availabilityWeeksDay) => availabilityWeeksDay.week_day === weekDay,
      ),
  )

  const blockedDaysRaw = await prisma.$queryRaw<
    Array<{ day: string; amount: number; size: number }>
  >`
    SELECT EXTRACT(DAY FROM S.date) AS day,
        COUNT(*) AS amount,
        ((UTI.time_end_in_minutes - UTI.time_start_in_minutes ) / 60) AS size
      FROM schedulings S
     
        LEFT JOIN user_time_intervals UTI 
          ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))

        WHERE S.user_id = ${
          user.id
        } and DATE_FORMAT(S.date, '%Y-%m' ) = ${`${year}-${month}`}
        GROUP BY EXTRACT(DAY FROM S.date),
          ((UTI.time_end_in_minutes - UTI.time_start_in_minutes ) / 60)
        HAVING amount >= size 
      
  `
  const blockedDate = blockedDaysRaw.map((item) => item.day)

  return res.status(200).json({ blockedWeekDays, blockedDate })
}
