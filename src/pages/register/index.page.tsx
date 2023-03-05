import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Heading, Text, MultiStep, TextInput, Button } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { RegisterContainer, Form, Header, FormError } from './styles'
import { useRouter } from 'next/router'
import { api } from '@/lib/axios'
import { NextSeo } from 'next-seo'

const registerFormSchema = zod.object({
  username: zod
    .string()
    .min(3, { message: 'Deve conter 3 letras' })
    .regex(/^([a-z\\-]+)$/i, { message: 'Deve conter letras ou hifens' })
    .transform((value) => value.toLowerCase()),
  name: zod.string().min(3, { message: 'Deve conter 3 letras' }),
})

type RegisterFormData = zod.infer<typeof registerFormSchema>

const Register: React.FC = () => {
  const router = useRouter()
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', data)
      router.push('/register/connect-calendar')
    } catch (error: any) {
      if (error?.response.data.message) {
        alert(error?.response.data.message)
        return
      }
      console.error(error)
    }
  }
  return (
    <>
      <NextSeo title="Crie uma conta | Felipe Call" />
      <RegisterContainer>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>
          <MultiStep size={4} currentStep={1} />
        </Header>
        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="fsantana.dev/"
              placeholder="seu-usuario"
              {...register('username')}
            />
            {errors.username && (
              <FormError size="sm">{errors.username.message}</FormError>
            )}
          </label>
          <label>
            <Text size="sm">Nome completo</Text>

            <TextInput placeholder="Seu nome" {...register('name')} />
            {errors.name && (
              <FormError size="sm">{errors.name.message}</FormError>
            )}
          </label>
          <Button type="submit" disabled={isSubmitting}>
            Proximo passo <ArrowRight />
          </Button>
        </Form>
      </RegisterContainer>
    </>
  )
}

export default Register
