import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import * as zod from 'zod'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { ZodError } from 'zod'

const timeIntervalBodySchema = zod.object({
  intervals: zod.array(
    zod.object({
      weekDay: zod.number(),
      startTimeInMinutes: zod.number(),
      endTimeInMinutes: zod.number(),
    }),
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(401).end()
  }
  try {
    const { intervals } = timeIntervalBodySchema.parse(req.body)
    await Promise.all(
      intervals.map((interval) =>
        prisma.userTimeInterval.create({
          data: {
            time_end_in_minutes: interval.endTimeInMinutes,
            time_start_in_minutes: interval.startTimeInMinutes,
            week_day: interval.weekDay,
            user_id: session.user.id,
          },
        }),
      ),
    )
    return res.status(201).end()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).end()
    }
    return res.status(500).end()
  }
}
