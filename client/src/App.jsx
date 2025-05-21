import React from "react";
import AppProviders from "./AppProviders";
import { createBrowserRouter, RouterProvider  } from "react-router-dom";
import SearchScreen from "./components/Search/SearchScreen";
import LoginScreen from "./components/Login/LoginScreen";
import ForgotPWDScreen from "./components/ForgotPassword/ForgotPWDScreen";
import StudentSignUp1Screen from "./components/StudentSignUp/StudentSignUp1Screen";
import StudentSignUp2Screen from "./components/StudentSignUp/StudentSignUp2Screen";
import TutorSignUp1Screen from "./components/TutorSignUp/TutorSignUp1Screen";
import TutorSignUp2Screen from "./components/TutorSignUp/TutorSignUp2Screen";
import ResultScreen from "./components/Results/ResultScreen";
import ChatScreen from "./components/Chat/ChatScreen";
import TutorHomeScreen from "./components/TutorHome/TutorHomeScreen";
import TutorInfoScreen from "./components/TutorInfo/TutorInfoScreen";
import StudentProfileScreen from "./components/StudentProfile/StudentProfileScreen";
import EditStudentProfileScreen from "./components/EditStudentProfile/EditStudentProfileScreen";
import EditTutorProfileScreen from "./components/EditTutorProfile/EditTutorProfileScreen";
import StudentHistoryScreen from "./components/History/StudentHistoryScreen";

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
        { path: 'tutor-signup-2', element: <TutorSignUp2Screen /> },
        { path: 'results', element: <ResultScreen /> },
        { path: 'chat', element: <ChatScreen /> },
        { path: 'tutor-home-page', element: <TutorHomeScreen /> },
        { path: 'tutor-info', element: <TutorInfoScreen />},
        { path: 'student-profile', element: <StudentProfileScreen />},
        { path: 'edit-stu-profile', element: <EditStudentProfileScreen />},
        { path: 'edit-ttr-profile', element: <EditTutorProfileScreen />},
        { path: 'student-history', element: <StudentHistoryScreen />}
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
