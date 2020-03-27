import React, {useEffect, useState} from 'react';
import {useNavigation} from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';

import logoImg from '../../assets/logo.png';
// this will automatically import the logo in the right size for the phone

import api from '../../services/api';

import {
  Container,
  Header,
  Image,
  HeaderText,
  BoldText,
  Title,
  Description,
  IncidentList,
  Incident,
  IncidentProperty,
  IncidentValue,
  DetailsButton,
  DetailsButtonText,
} from './styles';

export default function Incidents() {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  function navigateToDetail(incident) {
    navigation.navigate('Detail', { incident });
  }

  async function loadIncidents() {
    if(loading) {
      return;
    }

    if(total > 0 && incidents.length === total) {
      return;
    }

    setLoading(true);
    const response = await api.get(`incidents?page=${page}`);
    setPage(page + 1);

    setTotal(response.headers['x-total-count']);
    setIncidents([...incidents, ...response.data]);
    setLoading(false);

  }

  useEffect(() => {
    loadIncidents();
  }, [])

  return (
    <Container>
      <Header>
        <Image source={logoImg}/>
        <HeaderText>Total de <BoldText>{total} casos</BoldText>.</HeaderText>
      </Header>

      <Title>Bem-vindo</Title>
      <Description>Escolha um dos casos abaixo e salve o dia</Description>

      <IncidentList data={incidents} onEndReached={loadIncidents} onEndReachedThreshold={0.2} keyExtractor={incident => String(incident.id)} renderItem={({item })=> (
         <Incident>
          <IncidentProperty>ONG:</IncidentProperty>
          <IncidentValue>{item.name}</IncidentValue>

          <IncidentProperty>CASO:</IncidentProperty>
          <IncidentValue>{item.title}</IncidentValue>

          <IncidentProperty>VALOR:</IncidentProperty>
          <IncidentValue>
            {Intl.NumberFormat('pt-BR', {
              style: 'currency',
               currency: 'BRL'
            }).format(item.value)}
          </IncidentValue>

          <DetailsButton onPress={() => navigateToDetail(item)}>
            <DetailsButtonText>Ver mais detalhes</DetailsButtonText>
            <Feather name="arrow-right" size={16} color="#e02041"/>
          </DetailsButton>
        </Incident>
        )}/>
    </Container>
  )
}
