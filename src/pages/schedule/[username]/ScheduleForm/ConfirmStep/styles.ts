import { Box, styled, Text } from '@ignite-ui/react'

export const ConfirmStepForm = styled(Box, {
  maxWidth: 540,
  margin: '$6 auto 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
  marginTop: '$6',
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: '$regular',
    fontSize: '$sm',
    color: '$gray100',
    gap: '$2',
  },
})

export const ConfirmationStepHeader = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  borderBottom: '1px solid $gray600',
  alignItems: 'center',
  gap: '$4',
  [`${Text}`]: {
    display: 'flex',
    marginBottom: '$6',

    justifyContent: 'center',
    alignItems: 'center',
    gap: '$2',
    fontWeight: '$regular',
    svg: {
      width: '$5',
      height: '$5',
      color: '$gray200',
      lineHeight: 0,
    },
  },
})

export const ActionBox = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '$2',
})

export const FormError = styled(Text, {
  color: '#f75a68',
  fontWeight: '$regular',
})
