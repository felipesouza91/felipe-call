import Image from 'next/image'
import { Heading, Text } from '@ignite-ui/react'

import HomeImage from '../../assets/home_img.png'

import { HomeContainer, Hero, Preview } from './styles'
import { ClaimUserNameForm } from './Components/ClaimUsernameForm'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Felipe Call"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />
      <HomeContainer>
        <Hero>
          <Heading size="4xl">Agendamento descomplicado</Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre
          </Text>
          <ClaimUserNameForm />
        </Hero>
        <Preview>
          <Image
            src={HomeImage}
            alt="Calendario simbolizando a aplicação em funcionamento"
            height={400}
            quality={100}
            priority
          />
        </Preview>
      </HomeContainer>
    </>
  )
}
