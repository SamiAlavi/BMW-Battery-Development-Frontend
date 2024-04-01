import './App.css'
import Dashboard from './Dashboard';
import { PrimeReactProvider } from 'primereact/api';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex

export default function App() {
  const value = {
    ripple: true,
  };

  return (
    <PrimeReactProvider value={value}>
        <Dashboard />
    </PrimeReactProvider>
  );
}