import { Box, styled, Text } from '@ignite-ui/react'

export const ConnectBox = styled(Box, {
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const ConnectItem = styled(Box, {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  [`> ${Text}`]: {
    fontWeight: '$medium',
  },
})

export const AuthError = styled(Text, {
  color: '#f75a68',
  marginBottom: '$2',
  fontWeight: '$regular',
})
