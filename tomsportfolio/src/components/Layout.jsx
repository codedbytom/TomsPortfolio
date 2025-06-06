// Create a BaseLayout (no navigation) and MainLayout (with navigation)
import Navbar from './Navbar';
import { ThemeToggle } from './ThemeToggle';
const BaseLayout = ({ children }) => (
  <div className="theme-wrapper">
    <div className="me-2">
      <ThemeToggle />
    </div>
    <div className="container">
      {children}
    </div>
  </div>
);

const MainLayout = ({ children }) => (
  <div className="theme-wrapper">
    <div className="container">
      <Navbar />
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  </div>
);

export { BaseLayout, MainLayout };