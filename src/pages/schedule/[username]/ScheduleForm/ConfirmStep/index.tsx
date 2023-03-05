import React from 'react'
import { CalendarBlank, Clock } from 'phosphor-react'
import * as zod from 'zod'
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'

import {
  ConfirmStepForm,
  ConfirmationStepHeader,
  ActionBox,
  FormError,
} from './styles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { api } from '@/lib/axios'

const confirmFormSchema = zod.object({
  name: zod.string().min(3, { message: 'Nome é obrigatório' }),
  email: zod.string().email({ message: 'Digite um e-mail valido' }),
  observation: zod.string().nullable(),
})

type confirmFormData = zod.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
  scheduleDate: Date
  onCancel: (value?: Date) => void
}

const ConfirmStep: React.FC<ConfirmStepProps> = ({
  scheduleDate,
  onCancel,
}) => {
  const router = useRouter()

  const username = String(router.query.username)

  const {
    register,

    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<confirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  async function handeCreateSchedule(data: confirmFormData) {
    await api.post(`/users/${username}/schedule`, {
      ...data,
      date: scheduleDate,
    })
    handleClear()
  }

  async function handleClear() {
    onCancel()
  }

  return (
    <ConfirmStepForm as="form" onSubmit={handleSubmit(handeCreateSchedule)}>
      <ConfirmationStepHeader>
        <Text>
          <CalendarBlank />
          {dayjs(scheduleDate).format('DD [de] MMMM [de] YYYY')}
        </Text>

        <Text>
          <Clock />
          {dayjs(scheduleDate).format('HH:mm[h]')}
        </Text>
      </ConfirmationStepHeader>
      <label>
        Seu nome
        <TextInput placeholder="Nome" {...register('name')} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>
      <label>
        Endereço de e-mail
        <TextInput placeholder="Email" type="email" {...register('email')} />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>
      <label>
        Observações <TextArea {...register('observation')} />
      </label>

      <ActionBox>
        <Button type="button" variant="tertiary" onClick={handleClear}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </ActionBox>
    </ConfirmStepForm>
  )
}

export default ConfirmStep
