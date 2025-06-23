import { Outlet } from "react-router-dom";
import AuthListener from "./Login/AuthListener";

export default function RootLayout() {
  return (
    <>
      <AuthListener />
      <Outlet />
    </>
  );
}
