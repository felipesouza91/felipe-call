import React from 'react'
import { ArrowRight, Check } from 'phosphor-react'

import { Heading, Text, MultiStep, Button } from '@ignite-ui/react'

import { ConnectItem, ConnectBox, AuthError } from './styles'
import { Header, RegisterContainer } from '../styles'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const Register: React.FC = () => {
  const router = useRouter()
  const session = useSession()
  const hasAuthError = !!router.query.error
  const isSignIn = session.status === 'authenticated'

  async function handleConnectCallendar() {
    await signIn('google', { callbackUrl: '/register/connect-calendar' })
  }

  async function handleNextStep() {
    if (isSignIn) {
      await router.push('/register/time-intervals')
    }
  }

  return (
    <>
      <NextSeo
        title="Conecte sua agenda do google | Felipe Call"
        nofollow={true}
      />
      <RegisterContainer>
        <Header>
          <Heading as="strong">Conecte sua agenda!</Heading>
          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>
          <MultiStep size={4} currentStep={2} />
        </Header>
        <ConnectBox>
          <ConnectItem>
            <Text>Google Agenda</Text>
            {isSignIn ? (
              <Button size="sm" disabled>
                Conectado <Check />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleConnectCallendar}
              >
                Conectar
                <ArrowRight />
              </Button>
            )}
          </ConnectItem>
          {hasAuthError && (
            <AuthError size="sm">
              Falha ao se conectar ao Google, verifique as permissões ao Google
              Calaendar
            </AuthError>
          )}
          <Button disabled={!isSignIn} onClick={handleNextStep}>
            Proximo passo <ArrowRight />
          </Button>
        </ConnectBox>
      </RegisterContainer>
    </>
  )
}

export default Register
