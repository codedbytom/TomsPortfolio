import { Container } from '@mantine/core';
import Navbar from './Navbar';
import { ThemeToggle } from './ThemeToggle';

const BaseLayout = ({ children }) => (
  <div>
    <div style={{ position: 'fixed', top: '0.75rem', right: '1rem', zIndex: 200 }}>
      <ThemeToggle />
    </div>
    <Container size="lg" pt="xl">
      {children}
    </Container>
  </div>
);

const MainLayout = ({ children }) => (
  <div>
    <Navbar />
    <Container size="lg" style={{ paddingTop: '5rem' }}>
      {children}
    </Container>
  </div>
);

export { BaseLayout, MainLayout };
