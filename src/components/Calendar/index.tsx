import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { getWeekDay } from '@/utils/get-week-day'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useQuery } from '@tanstack/react-query'
import {
  CalendarContainer,
  CalendarHeader,
  CalendarTitle,
  CalendarBody,
  CalendarDay,
} from './styles'
import { useRouter } from 'next/router'
import { api } from '@/lib/axios'

interface BlockedWeekDaysDTO {
  blockedWeekDays: number[]
  blockedDate: number[]
}

interface CalendarProps {
  selectedDate?: Date | null
  onDateSelected: (date: Date) => void
}

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

const Calendar: React.FC<CalendarProps> = ({
  onDateSelected,
  selectedDate,
}) => {
  const router = useRouter()

  const username = String(router.query.username)

  const [firstMonthDate, setFirstMonthDate] = useState(() =>
    dayjs().set('date', 1),
  )
  const currentMonth = firstMonthDate.format('MMMM')
  const currentYear = firstMonthDate.format('YYYY')
  const selectedYear = dayjs().format('YYYY')
  const selectedMonth = dayjs().format('MM')

  const { data: queryData } = useQuery<BlockedWeekDaysDTO>(
    [`@${username}/blocked-dates`, `${selectedYear}-${selectedMonth}`],
    async () => {
      const params = new URLSearchParams({
        year: selectedYear,
        month: selectedMonth,
      })
      const { data } = await api.get<BlockedWeekDaysDTO>(
        `/users/${username}/blocked-dates`,
        {
          params,
        },
      )
      return data
    },
  )

  const calendarWeeks = useMemo(() => {
    if (!queryData) {
      return []
    }
    const firstWeekDay = firstMonthDate.get('day')
    const lastWeekDay = firstMonthDate.endOf('month').get('day')
    const latDayInMonth = firstMonthDate.endOf('month')
    const { blockedDate, blockedWeekDays } = queryData

    const dayInMonthArray = Array.from({
      length: firstMonthDate.daysInMonth(),
    }).map((_, index) => {
      const date = firstMonthDate.set('date', index + 1)
      return {
        date,
        disabled:
          date.endOf('day').isBefore(dayjs()) ||
          blockedWeekDays?.includes(date.get('day')) ||
          blockedDate?.includes(date.get('date')),
      }
    })

    const previewMonthDay = Array.from({
      length: firstWeekDay,
    })
      .map((_, index) => ({
        date: firstMonthDate.subtract(index + 1, 'day'),
        disabled: true,
      }))
      .reverse()

    const nextMonthDay = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, index) => ({
      date: latDayInMonth.add(index + 1, 'day'),
      disabled: true,
    }))

    const calendarDays = [
      ...previewMonthDay,
      ...dayInMonthArray,
      ...nextMonthDay,
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, index, original) => {
        const isNewWeek = index % 7 === 0
        if (isNewWeek) {
          weeks.push({
            week: index / 7 + 1,
            days: original.slice(index, index + 7),
          })
        }
        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [queryData, firstMonthDate])

  function handlePreviewMonth() {
    setFirstMonthDate((state) => state.subtract(1, 'month'))
  }
  function handleNextMonth() {
    setFirstMonthDate((state) => state.add(1, 'month'))
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth},<span> {currentYear}</span>
        </CalendarTitle>
        <div>
          <button onClick={handlePreviewMonth}>
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth}>
            <CaretRight />
          </button>
        </div>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {getWeekDay({ short: true }).map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map((week, index) => {
            return (
              <tr key={week.week}>
                {week.days.map(({ date, disabled }) => (
                  <td key={date.toString()}>
                    <CalendarDay
                      onClick={() => onDateSelected(date.toDate())}
                      disabled={disabled}
                    >
                      {date.get('date')}
                    </CalendarDay>
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}

export default Calendar
