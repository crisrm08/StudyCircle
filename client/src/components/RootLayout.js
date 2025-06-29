import AppProviders from "../AppProviders"; 
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  );
}