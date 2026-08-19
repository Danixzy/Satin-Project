import { Route, Routes } from 'react-router-dom';
import ListaCartas from './pages/ListaCartas';
import FormularioCarta from './pages/FormularioCarta';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ListaCartas />} />
      <Route path="/cartas/nova" element={<FormularioCarta />} />
      <Route path="/cartas/:id/editar" element={<FormularioCarta />} />
    </Routes>
  );
}
