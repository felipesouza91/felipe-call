import React from 'react'

import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Text, TextInput } from '@ignite-ui/react'

import { ArrowRight } from 'phosphor-react'

import { Form, FormAnnotation } from './styles'
import { useRouter } from 'next/router'

const claimUsernameFormSchema = zod.object({
  username: zod
    .string()
    .min(3, { message: 'Deve conter 3 letras' })
    .regex(/^([a-z\\-]+)$/i, { message: 'Deve conter letras ou hifens' })
    .transform((value) => value.toLowerCase()),
})

type ClaimUsernameFormData = zod.infer<typeof claimUsernameFormSchema>

const ClaimUserNameForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })
  const navigate = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    await navigate.push({
      pathname: 'register',
      query: data,
    })
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="fsantana.dev/"
          placeholder="Seu-usuario"
          {...register('username')}
        />

        <Button size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite um nome para usuario'}
        </Text>
      </FormAnnotation>
    </>
  )
}

export { ClaimUserNameForm }
