import Calendar from '@/components/Calendar'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import {
  CalendarStepContainer,
  TimePicker,
  PickerHeader,
  TimePickerList,
  TimePickerItem,
} from './styles'

interface AvailableTime {
  hour: number
  available: boolean
}

interface AvailableDTO {
  availableTime: AvailableTime[]
}

interface CalendarStepProps {
  onSelectScheduleDate: (value: Date) => void
}

const CalendarStep: React.FC<CalendarStepProps> = ({
  onSelectScheduleDate,
}) => {
  const router = useRouter()

  const [selectedDay, setSelecteDay] = useState<Date | null>(null)

  const hasSelectDay = !!selectedDay

  const username = String(router.query.username)

  const formateSelectedDay = dayjs(selectedDay).format('YYYY-MM-DD')

  const { data: possibleTimes } = useQuery<AvailableTime[]>(
    [`@${username}/availableTime`, formateSelectedDay],
    async () => {
      const params = new URLSearchParams({
        date: formateSelectedDay,
      })
      const {
        data: { availableTime },
      } = await api.get<AvailableDTO>(`/users/${username}/availability`, {
        params,
      })
      return availableTime
    },
    {
      enabled: !!selectedDay,
    },
  )

  function onDateSelected(date: Date) {
    setSelecteDay(date)
  }

  function handleSelectTimScheduleDate(hour: number) {
    onSelectScheduleDate(
      dayjs(selectedDay!).startOf('hours').set('hour', hour).toDate(),
    )
  }

  return (
    <CalendarStepContainer isTimePickerOpen={hasSelectDay}>
      <Calendar selectedDate={selectedDay} onDateSelected={onDateSelected} />
      {hasSelectDay && (
        <TimePicker>
          <PickerHeader>
            {dayjs(selectedDay!).format('dddd')},
            <span> {dayjs(selectedDay).format('DD [de] MMMM')} </span>
          </PickerHeader>
          <TimePickerList>
            {possibleTimes?.map(({ hour, available }) => (
              <TimePickerItem
                onClick={() => handleSelectTimScheduleDate(hour)}
                key={hour}
                disabled={
                  dayjs().isAfter(dayjs(selectedDay).set('hours', hour)) ||
                  !available
                }
              >
                {hour}:00h
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </CalendarStepContainer>
  )
}

export default CalendarStep
