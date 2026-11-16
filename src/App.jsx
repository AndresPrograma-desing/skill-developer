import { Routes, Route } from 'react-router-dom';
import { Home, F1 } from './app/screens/screens';
import { ROUTES } from './constants/routes';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.F1} element={<F1 />} />
    </Routes>
  );
}

export default App;
