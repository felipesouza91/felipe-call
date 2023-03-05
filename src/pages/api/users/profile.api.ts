import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import * as zod from 'zod'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { ZodError } from 'zod'

const updateProfileDataSchema = zod.object({
  bio: zod.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
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
    const { bio } = updateProfileDataSchema.parse(req.body)
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        bio,
      },
    })
    return res.status(204).end()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).end()
    }
    return res.status(500).end()
  }
}
