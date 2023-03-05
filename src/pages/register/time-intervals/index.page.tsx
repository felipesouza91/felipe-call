import React from 'react'
import { ArrowRight } from 'phosphor-react'
import * as zod from 'zod'
import {
  Heading,
  Text,
  MultiStep,
  Button,
  Checkbox,
  TextInput,
} from '@ignite-ui/react'

import {
  IntervalBox,
  IntervalContainer,
  IntervalItem,
  Container,
} from './styles'

import { FormError, Header, RegisterContainer } from '../styles'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { getWeekDay } from '@/utils/get-week-day'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-in-minutes'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const timeIntervalFormSchema = zod.object({
  intervals: zod
    .array(
      zod.object({
        weekDay: zod.number().min(0).max(6),
        enabled: zod.boolean(),
        startTime: zod.string(),
        endTime: zod.string(),
      }),
    )
    .length(7)
    .transform((intervals) =>
      intervals.filter((intervals) => intervals.enabled),
    )
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana',
    })
    .transform((intervals) =>
      intervals.map((interval) => ({
        weekDay: interval.weekDay,
        startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
        endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
      })),
    )
    .refine(
      (intervals) =>
        intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        ),
      {
        message:
          'O horário de termino deve ser pelo menos 1 hora distante do inicio',
      },
    ),
})

type TimeIntervalsFormInput = zod.input<typeof timeIntervalFormSchema>
type TimeIntervalFormOutput = zod.infer<typeof timeIntervalFormSchema>

const TimeIntervals: React.FC = () => {
  const router = useRouter()
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalFormSchema),
    defaultValues: {
      intervals: [
        {
          weekDay: 0,
          enabled: false,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 1,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 2,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 3,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 4,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 5,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 6,
          enabled: false,
          startTime: '08:00',
          endTime: '18:00',
        },
      ],
    },
  })

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  const intervals = watch('intervals')

  async function handleSetTimeIntervals(data: any) {
    try {
      const formData = data as TimeIntervalFormOutput
      await api.post('/users/time-intervals', formData)
      await router.push('/register/update-profile')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <NextSeo
        title="Selecione a sua disponibilidade | Felipe Call"
        nofollow={true}
      />
      <RegisterContainer>
        <Header>
          <Heading as="strong">Quase lá</Heading>
          <Text>
            Defina o intervalo de horários que você está disponível em cada dia
            da semana.
          </Text>
          <MultiStep size={4} currentStep={3} />
        </Header>
        <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
          <IntervalContainer>
            {fields.map((interval, index) => (
              <IntervalItem key={interval.weekDay}>
                <Container size="md">
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        checked={field.value}
                      />
                    )}
                  />

                  <Text size="sm">{getWeekDay({})[interval.weekDay]}</Text>
                </Container>
                <Container>
                  <TextInput
                    disabled={!intervals[index].enabled}
                    size="sm"
                    type="time"
                    step={60}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <TextInput
                    disabled={!intervals[index].enabled}
                    size="sm"
                    type="time"
                    step={60}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </Container>
              </IntervalItem>
            ))}
          </IntervalContainer>
          {errors.intervals?.message && (
            <FormError size="sm">{errors.intervals.message}</FormError>
          )}
          <Button type="submit" disabled={isSubmitting}>
            Proximo passo <ArrowRight />
          </Button>
        </IntervalBox>
      </RegisterContainer>
    </>
  )
}

export default TimeIntervals
