import { Box, styled, Text } from '@ignite-ui/react'

export const UpdateProfileBox = styled(Box, {
  marginTop: '$6',
  padding: '$6',

  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',

    [`${Text}`]: {
      fontWeight: '$regular',
    },
  },
})

export const ProfileContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '$4',
  flexDirection: 'row',
})

export const FormAnnotaion = styled(Text, {
  color: '$gray200',
})
