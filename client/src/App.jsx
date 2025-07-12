import React from "react";
import AppProviders from "./AppProviders";
import { createBrowserRouter, RouterProvider  } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import LoadingScreen from "./components/Common/LoadingScreen";
import SearchScreen from "./components/Search/SearchScreen";
import LoginScreen from "./components/Login/LoginScreen";
import PickRoleScreen from "./components/Login/PickRoleScreen";
import ForgotPWDScreen from "./components/ForgotPassword/ForgotPWDScreen";
import StudentSignUp1Screen from "./components/StudentSignUp/StudentSignUp1Screen";
import StudentSignUp2Screen from "./components/StudentSignUp/StudentSignUp2Screen";
import StudentSignUp3Screen from "./components/StudentSignUp/StudentSignUp3Screen";
import TutorSignUp1Screen from "./components/TutorSignUp/TutorSignUp1Screen";
import TutorSignUp2Screen from "./components/TutorSignUp/TutorSignUp2Screen";
import TutorSignUp3Screen from "./components/TutorSignUp/TutorSignUp3Screen";
import ResultScreen from "./components/Results/ResultScreen";
import TutorFactsScreen from "./components/TutorFacts/TutorFactsScreen";
import ChatScreen from "./components/Chat/ChatScreen";
import TutorHomeScreen from "./components/TutorHome/TutorHomeScreen";
import StudentFactsScreen from "./components/StudentFacts/StudentFactsScreen";
import TutorProfileScreen from "./components/TutorProfile/TutorProfileScreen";
import StudentProfileScreen from "./components/StudentProfile/StudentProfileScreen";
import EditStudentProfileScreen from "./components/EditStudentProfile/EditStudentProfileScreen";
import EditTutorProfileScreen from "./components/EditTutorProfile/EditTutorProfileScreen";
import StudentHistoryScreen from "./components/History/StudentHistoryScreen";
import PaymentMethodScreen from "./components/PaymentMethod/PaymentMethodScreen";
import TutorPaymentScreen from "./components/TutorPayment/TutorPaymentScreen";

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <SearchScreen /> },        
        { path: 'login', element: <LoginScreen /> },
        { path: 'forgot-pwd', element: <ForgotPWDScreen />},
        { path: 'pick-role', element: <PickRoleScreen />},
        { path: 'student-signup-1', element: <StudentSignUp1Screen /> },
        { path: 'student-signup-2', element: <StudentSignUp2Screen /> },
        { path: 'student-signup-3', element: <StudentSignUp3Screen /> }, 
        { path: 'tutor-signup-1', element: <TutorSignUp1Screen /> },
        { path: 'tutor-signup-2', element: <TutorSignUp2Screen /> },
        { path: 'tutor-signup-3', element: <TutorSignUp3Screen /> },
        { path: 'results', element: <ResultScreen /> },
        { path: '/tutor-facts/:id', element: <TutorFactsScreen />},
        { path: 'chat', element: <ChatScreen /> },
        { path: 'tutor-home-page', element: <TutorHomeScreen /> },
        { path: '/student-facts/:id', element: <StudentFactsScreen/>},
        { path: 'tutor-profile', element: <TutorProfileScreen />},
        { path: 'student-profile', element: <StudentProfileScreen />},
        { path: 'edit-student-profile', element: <EditStudentProfileScreen />},
        { path: 'edit-tutor-profile', element: <EditTutorProfileScreen />},
        { path: 'student-history', element: <StudentHistoryScreen />},
        { path: 'payment-method', element: <PaymentMethodScreen />},
        { path: 'tutor-payment-settings', element: <TutorPaymentScreen /> }
      ]
    }
  ]);
  return (
    <RouterProvider router={router}>
      <AppProviders>
      </AppProviders>
    </RouterProvider>
  );
}

export default App;
