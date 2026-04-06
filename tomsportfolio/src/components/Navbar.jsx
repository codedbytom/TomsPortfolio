import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Group, Burger, Drawer, Stack, Text, Box, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { label: 'Resume', to: '/resume' },
  { label: 'Text Demo', to: '/text-demo/opt-in' },
  { label: 'Coding Challenges', to: '/coding-challenges' },
  { label: 'Hobbies', to: '/hobbies' },
];

function Navbar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const location = useLocation();

  return (
    <>
      <Box
        component="nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: 'var(--mantine-color-body)',
          borderBottom: '1px solid var(--mantine-color-default-border)',
          padding: '0.75rem 1.5rem',
        }}
      >
        <Group justify="space-between" align="center">
          <Text
            component={Link}
            to="/"
            fw={700}
            size="lg"
            c="blue"
            style={{ textDecoration: 'none' }}
          >
            My Portfolio
          </Text>

          {/* Desktop nav */}
          <Group gap="xl" visibleFrom="sm">
            {navLinks.map(({ label, to }) => (
              <Text
                key={to}
                component={Link}
                to={to}
                size="sm"
                fw={location.pathname === to ? 600 : 400}
                c={location.pathname === to ? 'blue' : undefined}
                style={{ textDecoration: 'none' }}
              >
                {label}
              </Text>
            ))}
            <ThemeToggle />
          </Group>

          {/* Mobile: toggle + burger */}
          <Group hiddenFrom="sm">
            <ThemeToggle />
            <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
          </Group>
        </Group>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title="Navigation"
        position="right"
        size="xs"
      >
        <Stack gap="md" mt="md">
          {navLinks.map(({ label, to }) => (
            <Text
              key={to}
              component={Link}
              to={to}
              size="md"
              fw={location.pathname === to ? 600 : 400}
              c={location.pathname === to ? 'blue' : undefined}
              style={{ textDecoration: 'none' }}
              onClick={close}
            >
              {label}
            </Text>
          ))}
        </Stack>
      </Drawer>
    </>
  );
}

export default Navbar;
