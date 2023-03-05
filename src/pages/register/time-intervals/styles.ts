import { Box, styled, Text } from '@ignite-ui/react'

export const IntervalBox = styled(Box, {
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})
export const IntervalContainer = styled('div', {
  border: '1px solid $gray600',
  borderRadius: '$md',
})

export const IntervalItem = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$3 $4',
  gap: '$3',

  '& + &': {
    borderTop: '1px solid $gray600',
  },

  [`${Text}`]: {
    fontWeight: '$regular',
    marginRight: 'auto',
  },
})
export const Container = styled('div', {
  maxWidth: 190,
  display: 'flex',
  flexDirection: 'row',

  alignItems: 'center',
  justifyContent: 'center',
  input: {
    fontWeight: '$regular',
    '&::-webkit-calendar-picker-indicator': {
      filter: 'invert(100%) brightness(30%)',
    },
  },
  variants: {
    size: {
      sm: {
        gap: '$2',
      },
      md: {
        gap: '$3',
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})
