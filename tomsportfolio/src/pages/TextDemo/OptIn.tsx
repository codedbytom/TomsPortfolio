import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BaseLayout } from '../../components/Layout';
import {
  TextInput,
  NativeSelect,
  Button,
  Card,
  Text,
  Checkbox,
  Group,
  Stack,
  Image,
  Anchor,
} from '@mantine/core';

const SmsOptIn = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    countryCode: '1',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConsenting, setIsConsenting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const pingServer = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL_HTTP}/api/OptIn/Ping`);
        console.log('Server is reachable:', response.data);
      } catch (error) {
        console.error('Server is not reachable:', error);
      }
    };
    pingServer();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.phoneNumber.length < 9) {
      alert('Phone number must be at least 9 digits long');
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL_HTTP}/api/OptIn/AddContact`, {
        phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
        name: formData.name,
      });
      navigate('/text-demo/sms-preview', {
        state: {
          phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
          contactName: formData.name,
          justOptedIn: true,
        },
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data || error.message || 'An error occurred');
      } else {
        alert('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseLayout>
      <Image src="/media/TBI_Logo.png" alt="Logo" h={64} w="auto" fit="contain" mx="auto" mb="md" className="SmsOptInLogo" />

      <Stack maw={600} mx="auto" mt="xl">
        <Text size="xl" fw={600} ta="center">Text Message Demo</Text>

        <Card withBorder radius="md" ta="center" py="sm">
          <Text size="sm" c="dimmed">
            Please provide your phone number below if you would like to subscribe for Text Message Surveys
          </Text>
        </Card>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <div>
              <Text size="sm" fw={500} mb={4}>Phone Number</Text>
              <Group gap={0} align="flex-start">
                <NativeSelect
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  data={[
                    { value: '1', label: '+1 (US)' },
                    { value: '44', label: '+44 (UK)' },
                    { value: '52', label: '+52 (MX)' },
                  ]}
                  style={{ width: '7.5rem', borderRadius: '0.25rem 0 0 0.25rem' }}
                />
                <TextInput
                  name="phoneNumber"
                  inputMode="numeric"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  style={{ flex: 1 }}
                  styles={{ input: { borderRadius: '0 0.25rem 0.25rem 0' } }}
                />
              </Group>
            </div>

            <Checkbox
              label="I agree to receive text message surveys and alerts from Tom Built It."
              checked={isConsenting}
              onChange={(e) => setIsConsenting(e.currentTarget.checked)}
            />

            <Group justify="center">
              <Button type="submit" loading={isSubmitting} disabled={!isConsenting}>
                Submit
              </Button>
            </Group>
          </Stack>
        </form>

        <Card withBorder radius="md" ta="center" py="sm">
          <Text size="xs" c="dimmed">
            Tom Built It text message surveys. Message and data rates may apply. Message frequency varies. Text HELP for help. Text STOP to opt-out.{' '}
            <Anchor component={Link} to="/legal/terms-and-conditions" size="xs">Terms & Conditions</Anchor>
            {' '}and{' '}
            <Anchor component={Link} to="/legal/privacy-policy" size="xs">Privacy Policy</Anchor>.
          </Text>
        </Card>
      </Stack>
    </BaseLayout>
  );
};

export default SmsOptIn;
