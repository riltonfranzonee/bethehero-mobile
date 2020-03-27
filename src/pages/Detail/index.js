import React from 'react';
import {Alert, Linking} from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import {useNavigation, useRoute} from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import logoImg from '../../assets/logo.png';

import {
  Container,
  Header,
  Image,
  BackButtonNav,
  Incident,
  IncidentProperty,
  IncidentValue,
  Contact,
  HeroTitle,
  HeroDescription,
  Actions,
  Action,
  ActionText
} from './styles';

export default function Detail() {
  const navigation = useNavigation();
  const route = useRoute();

  const incident = route.params.incident;

  const message = 'Olá APAD, estou entrando em contato pois gostaria de ajudar no caso "Cadela atropelada" com o valor de R$120,00'

  function navigateBack() {
    navigation.goBack();
  }

  async function sendMail() {
    try {
      await MailComposer.composeAsync({
        subject: `Herói do caso: ${incident.title}`,
        recipients: [incident.email],
        body: message,
      })
    } catch(err) {
      Alert.alert('Você precisa estar logado em um email no seu celular')
    }
  }

  async function sendWhatsapp() {
    try{
      await Linking.openURL(`whatsapp://send?phone=55${incident.phone}&text=${message}`);
    } catch(err) {
      Alert.alert('Você precisa ter o whatsapp instalado no seu celular')
    }
  }

  return (
    <Container>
      <Header>
        <Image source={logoImg}/>
        <BackButtonNav onPress={() => navigateBack()}>
          <Feather name="arrow-left" size={28} color="#e02041" />
        </BackButtonNav>
      </Header>
      <Incident>
      <IncidentProperty firstIncident>ONG:</IncidentProperty>
          <IncidentValue>{incident.name} de {incident.city} - {incident.uf}</IncidentValue>

          <IncidentProperty>CASO:</IncidentProperty>
          <IncidentValue>{incident.title}</IncidentValue>

          <IncidentProperty>VALOR:</IncidentProperty>
          <IncidentValue>
            {Intl.NumberFormat('pt-BR', {
              style: 'currency',
               currency: 'BRL'
            }).format(incident.value)}
          </IncidentValue>
      </Incident>
      <Contact>
        <HeroTitle>Salve o dia!</HeroTitle>
        <HeroTitle>Seja o herói desse caso</HeroTitle>
        <HeroDescription>Entre em contato:</HeroDescription>
        <Actions>
          <Action onPress={sendWhatsapp}>
            <ActionText>Whatsapp</ActionText>
          </Action>
          <Action onPress={sendMail}>
            <ActionText>E-mail</ActionText>
          </Action>
        </Actions>
      </Contact>
    </Container>
  );
}
