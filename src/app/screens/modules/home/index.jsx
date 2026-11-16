import { Text, CardV1 } from 'anteriority-ui';
import { Trophy } from 'lucide-react';

import styles from './styles.module.scss';

// Catálogo de componentes: importá acá cada componente que quieras probar
// y renderizalo debajo, igual que CardV1.
export const Home = () => (
  <div className={styles.main}>
    <Text variant="h1">Catálogo de componentes</Text>

    <CardV1 primaryText="Tarjeta de muestra" secondaryText="123" badgeIcon={Trophy} badgeText="Ejemplo" />
  </div>
);

export default Home;
