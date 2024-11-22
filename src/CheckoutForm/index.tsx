import React, { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { CardElement, useStripe, useElements, CardElementProps } from '@stripe/react-stripe-js';

const Container = styled.div`
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.header`
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
  border-radius: 10px 10px 0 0;
  font-size: 24px;
`;

const FormContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledButton = styled.button`
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #444;
  }
`;

const Message = styled.p`
  margin-top: 10px;
  color: #666;
`;

const StyledCardElement = styled(CardElement)`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  background-color: #fff;
  color: #333;
  height: auto;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;

  &::placeholder {
    color: #888;
  }
`;

interface CheckoutFormProps {
  totalAmount: number;
}

const CheckoutForm: React.FC<{ totalAmount: number }> = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setMessage('Processing payment...');

    try {
      const response = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: Math.round(totalAmount)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment intent');
      }

      const { clientSecret } = await response.json();
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('CardElement not found');
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        setMessage(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent?.status === 'succeeded') {
        setMessage('Payment successful!');
      }
    } catch (error) {
      setMessage(`Payment failed: ${(error as Error).message}`);
    }
  };

  const cardStyle: CardElementProps['options'] = {
    style: {
      base: {
        fontSize: '16px',
        color: '#333',
        '::placeholder': { color: '#888' },
      },
      invalid: { color: '#f44336' },
    },
  };

  return (
    <Container>
      <Header>
        <h1>Payment App</h1>
      </Header>
      <FormContainer>
        <StyledForm onSubmit={handleSubmit}>
          <StyledCardElement options={cardStyle} />
          <StyledButton type="submit">Pay Now</StyledButton>
          <Message>{message}</Message>
        </StyledForm>
      </FormContainer>
    </Container>
  );
};

export default CheckoutForm;
