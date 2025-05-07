import React from "react";
import AppProviders from "./AppProviders";
import { createBrowserRouter, RouterProvider  } from "react-router-dom";
import SearchScreen from "./components/SearchScreen";
import LoginScreen from "./components/LoginScreen";
import ForgotPWDScreen from "./components/ForgotPWDScreen";
import StudentSignUp1Screen from "./components/StudentSignUp1Screen";
import StudentSignUp2Screen from "./components/StudentSignUp2Screen";
import TutorSignUp1Screen from "./components/TutorSignUp1Screen";
import TutorSignUp2Screen from "./components/TutorSignUp2Screen";
import ResultScreen from "./components/ResultScreen";
import ChatScreen from "./components/ChatScreen";
import TutorScreen from "./components/TutorScreen";

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      children: [
        { index: true, element: <SearchScreen /> },        
        { path: 'login', element: <LoginScreen /> },
        { path: 'forgotpwd', element: <ForgotPWDScreen />},
        { path: 'studentsignup1', element: <StudentSignUp1Screen /> },
        { path: 'studentsignup2', element: <StudentSignUp2Screen /> },
        { path: 'tutorsignup1', element: <TutorSignUp1Screen /> },
        { path: 'tutorsignup2', element: <TutorSignUp2Screen /> },
        { path: 'results', element: <ResultScreen /> },
        { path: 'chat', element: <ChatScreen /> },
        { path: 'tutorhomepage', element: <TutorScreen /> },
      ]
    }
  ]);
  return (
    <AppProviders>
        <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
