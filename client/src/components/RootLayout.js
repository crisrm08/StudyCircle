import { Outlet } from 'react-router-dom';
import AppProviders from '../AppProviders';
import { useUser } from '../contexts/UserContext';
import LoadingScreen from './Common/LoadingScreen';

export default function RootLayout() {
  return (
    <AppProviders>
      <InnerRoot />
    </AppProviders>
  );
}

function InnerRoot() {
  const { loading } = useUser();
  if (loading) return <LoadingScreen />;
  return <Outlet />;
}
