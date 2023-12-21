import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorPage from './components/errorPage';
import RmnMotor from './components/rmnMotor';
import Sdf from './components/sdf';
import Rmn from './components/rmn';
import { getSdfFilesNames } from './components/sdf';
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import { getRmnFilesNames } from './components/rmn';
import Profile, {getUser} from "./components/profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path:"/",
        element:<RmnMotor/>,
        loader: async () => {
          const sdfData = await getSdfFilesNames();
          const rmnData = await getRmnFilesNames();
          return { sdfData, rmnData };
        }
      },
      {
        path:"/sdf",
        element:<Sdf/>,
        loader: getSdfFilesNames
      },
      {
        path:"/rmnDB",
        element:<Rmn/>,
        loader: getRmnFilesNames
      },
      {
        path:"/sign-in",
        element:<SignIn/>
      },
      {
        path:"/sign-up",
        element:<SignUp/>
      },
      {
        path:"/profile",
        element:<Profile/>,
        loader: getUser
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*<App/>*/}
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
