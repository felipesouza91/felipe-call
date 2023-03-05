import { Box, styled, Text } from '@ignite-ui/react'

export const CalendarStepContainer = styled(Box, {
  margin: '$6 auto 0',
  padding: 0,
  display: 'grid',
  position: 'relative',

  variants: {
    isTimePickerOpen: {
      true: {
        gridTemplateColumns: '1fr 280px',
        '@media(max-width:900px)': {
          gridTemplateColumns: '1fr',
        },
      },
      false: {
        width: 540,
        gridTemplateColumns: '1fr',
      },
    },
  },
})

export const TimePicker = styled('div', {
  borderLeft: '1px solid $gray600',
  padding: '$6 $6 0',
  overflowY: 'scroll',

  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  width: 280,
})

export const PickerHeader = styled(Text, {
  fontWeight: '$medium',
  span: {
    color: '$gray200',
  },
})

export const TimePickerList = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2',
  '@media(max-width:900px)': {
    gridTemplateColumns: '2fr',
  },
})

export const TimePickerItem = styled('button', {
  all: 'unset',
  padding: '$2 0',
  textAlign: 'center',
  background: '$gray600',
  borderRadius: '$sm',
  cursor: 'pointer',
  fontSize: '$sm',
  fontWeight: '$regular',
  lineHeight: '$base',
  color: '$gray100',

  '&:last-child': {
    marginBottom: '$6',
  },
  '&:disabled': {
    background: 'none',
    cursor: 'default',
  },
  '&:not(:disabled):hover': {
    background: '$gray500',
  },
  '&:focus:': {
    boxShadow: '0 0 0 $colors$gray100',
  },
})
