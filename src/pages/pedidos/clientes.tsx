import { FormEvent, useState } from 'react';
import { Stack, Text, Box, useToast } from '@chakra-ui/react';
import { Heading } from '../../components/heading';
import { Field } from '../../components/field';
import { Button } from '../../components/button';
import { capitalize } from '../../utils/capitalize';
import { useShoppingCartContext } from '../../contexts/shopping-cart';
import { IProduct } from '../../core/product';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';

export interface IClientData {
  name: string;
  email: string;
}

export interface ClientData {
  client: IClientData;
  products: IProduct[];
}

export default function Pedidos() {
  const shoppingCart = useShoppingCartContext();
  const { push } = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const toast = useToast();

  function createToast(status: 'error' | 'success', description: string) {
    const title = status === 'error' ? 'Error' : 'Sucesso';
    toast({
      title,
      status,
      description,
      position: 'top-right',
      duration: 7_500,
      isClosable: true,
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement & HTMLDivElement>
  ) {
    event.preventDefault();
    const data: ClientData = {
      client: {
        name,
        email,
      },
      products: shoppingCart.products,
    };
    const response = await axios.post('/api/send-client-email', data, {
      validateStatus: null,
    });
    const isError = response.status !== 200;
    createToast(isError ? 'error' : 'success', response.data);
    if (!isError) {
      shoppingCart.clear();
      push('/');
    }
  }

  return (
    <Box className="paddingX paddingY" as="form" onSubmit={handleSubmit}>
      <Stack spacing="2.25rem" maxWidth="22.5rem">
        <Stack spacing="1rem">
          <Heading whiteSpace="nowrap" padding="0">
            Orçamento
          </Heading>
          <Text fontSize="md" fontWeight="500">
            Você receberá o seu orçamento por e-mail, para isso, preencha os
            campos a seguir
          </Text>
        </Stack>

        <Stack spacing="1.5rem">
          <Field
            label="Nome"
            name="name"
            value={name}
            onChange={(event) => {
              const name = capitalize(event.currentTarget.value);
              setName(name);
            }}
          />
          <Field
            label="E-mail"
            name="email"
            type="email"
            value={email}
            onChange={(event) => {
              const email = event.currentTarget.value.toLowerCase();
              setEmail(email);
            }}
          />
        </Stack>
        <Button width="100%" padding="1rem 0.75rem" fontSize="md">
          Solicitar orçamento
        </Button>
      </Stack>
    </Box>
  );
}
