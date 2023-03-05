import { Heading, styled, Text } from '@ignite-ui/react'

export const ScheduleContainer = styled('div', {
  maxWidth: 852,
  margin: '$20 auto $4',
  padding: '0 $4',
})

export const UserHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',

  [`${Heading}`]: {
    lineHeight: '$base',
    marginTop: '$2',
  },
  [`${Text}`]: {
    fontWeight: '$regular',
    color: '$gray200',
  },
})
