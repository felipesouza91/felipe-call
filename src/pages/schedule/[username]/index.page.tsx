import { prisma } from '@/lib/prisma'

import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'

import React from 'react'
import ScheduleForm from './ScheduleForm'

import { UserHeader, ScheduleContainer } from './styles'

interface ScheduleProps {
  user: {
    name: string
    username: string
    avatarUrl: string
    bio: string
  }
}

const Schedule: React.FC<ScheduleProps> = ({ user }) => {
  return (
    <>
      <NextSeo title={`Agendar com ${user.name} | Felipe Call`} />
      <ScheduleContainer>
        <UserHeader>
          <Avatar src={user.avatarUrl} alt={user.username} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </UserHeader>
        <ScheduleForm />
      </ScheduleContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })
  if (!user) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      user: {
        name: user.name,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}

export default Schedule
