import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { Adapter } from 'next-auth/adapters'
import { destroyCookie, parseCookies } from 'nookies'
import { prisma } from '../prisma'

export function PrismaAdapter(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): Adapter {
  return {
    async createUser(user) {
      const { '@felipe-call:userId': userIdOnCookies } = parseCookies({ req })
      if (!userIdOnCookies) {
        throw new Error('User id not found in cookies')
      }
      const prismaUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      destroyCookie({ res }, '@felipe-call:userId', { path: '/' })
      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        emailVerified: null,
        avatar_url: prismaUser.avatar_url!,
        bio: prismaUser.bio,
      }
    },
    async getUser(id) {
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
        bio: user.bio,
      }
    },
    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        bio: user.bio,
        avatar_url: user.avatar_url!,
      }
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })
      if (!account) {
        return null
      }
      return {
        id: account.user.id,
        name: account.user.name,
        username: account.user.username,
        email: account.user.email!,
        emailVerified: null,
        avatar_url: account.user.avatar_url!,
        bio: account.user.bio,
      }
    },

    async updateUser(user) {
      const userSaved = await prisma.user.update({
        where: {
          id: user.id!,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })
      return {
        id: userSaved.id,
        name: userSaved.name,
        username: userSaved.username,
        email: userSaved.email!,
        emailVerified: null,
        avatar_url: userSaved.avatar_url!,
        bio: userSaved.bio,
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      const session = await prisma.session.create({
        data: {
          expires,
          user_id: userId,
          session_token: sessionToken,
        },
      })
      return {
        expires: session.expires,
        sessionToken: session.session_token,
        userId: session.user_id,
      }
    },

    async getSessionAndUser(sessionToken) {
      const sessionPrisma = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: { user: true },
      })

      if (!sessionPrisma) {
        return null
      }

      return {
        session: {
          expires: sessionPrisma.expires,
          sessionToken: sessionPrisma.session_token,
          userId: sessionPrisma.user_id,
        },
        user: {
          id: sessionPrisma.user.id,
          name: sessionPrisma.user.name,
          username: sessionPrisma.user.username,
          email: sessionPrisma.user.email!,
          emailVerified: null,
          avatar_url: sessionPrisma.user.avatar_url!,
          bio: sessionPrisma.user.bio,
        },
      }
    },

    async updateSession({ sessionToken, expires, userId }) {
      const session = await prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        data: { session_token: sessionToken, expires, user_id: userId },
      })
      return {
        expires: session.expires,
        sessionToken: session.session_token,
        userId: session.user_id,
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken,
        },
      })
    },
  }
}
