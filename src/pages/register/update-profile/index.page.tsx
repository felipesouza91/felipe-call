import React from 'react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Header, RegisterContainer } from '../styles'
import { UpdateProfileBox, ProfileContainer, FormAnnotaion } from './styles'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const updateProfileFormData = zod.object({
  bio: zod.string(),
})

type UpdateProfileFormData = zod.infer<typeof updateProfileFormData>

const UpdateProfile: React.FC = () => {
  const { register, handleSubmit } = useForm<UpdateProfileFormData>()
  const session = useSession()
  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfileFormData) {
    try {
      await api.put('/users/profile', data)
      await router.push(`/schedule/${session.data?.user.username}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <NextSeo title="Atualize seu perfil | Felipe Call" nofollow={true} />
      <RegisterContainer>
        <Header>
          <Heading as="strong">Defina sua disponibilidade</Heading>
          <Text>Por último, uma breve descrição e uma foto de perfil.</Text>
          <MultiStep size={4} currentStep={4} />
        </Header>
        <UpdateProfileBox
          as="form"
          onSubmit={handleSubmit(handleUpdateProfile)}
        >
          <label>
            <Text size="sm">Foto de perfil</Text>
            <ProfileContainer>
              <Avatar
                src={session.data?.user.avatar_url}
                alt={session.data?.user.name}
              />
            </ProfileContainer>
          </label>
          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea {...register('bio')} />
            <FormAnnotaion size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </FormAnnotaion>
          </label>
          <Button>
            Finalizar <ArrowRight />
          </Button>
        </UpdateProfileBox>
      </RegisterContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )
  return {
    props: { session },
  }
}

export default UpdateProfile
