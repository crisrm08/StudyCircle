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
import TutorInfoScreen from "./components/TutorInfoScreen";
import StudentProfileScreen from "./components/StudentProfileScreen";

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      children: [
        { index: true, element: <SearchScreen /> },        
        { path: 'login', element: <LoginScreen /> },
        { path: 'forgot-pwd', element: <ForgotPWDScreen />},
        { path: 'student-signup-1', element: <StudentSignUp1Screen /> },
        { path: 'student-signup-2', element: <StudentSignUp2Screen /> },
        { path: 'tutor-signup-1', element: <TutorSignUp1Screen /> },
        { path: 'tutorsignup-2', element: <TutorSignUp2Screen /> },
        { path: 'results', element: <ResultScreen /> },
        { path: 'chat', element: <ChatScreen /> },
        { path: 'tutor-home-page', element: <TutorScreen /> },
        { path: 'tutor-info', element: <TutorInfoScreen />},
        { path: 'student-profile', element: <StudentProfileScreen />},
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
