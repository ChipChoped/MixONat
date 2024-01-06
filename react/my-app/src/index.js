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
import Motor from './components/motor';
import File from './components/file';
import { getFilesInfo } from './components/file';
import SignIn, {checkToken} from "./components/signIn";
import SignUp from "./components/signUp";
import Profile, {getUserInfoAndFiles} from "./components/profile";
import Preview, {getFile} from "./components/preview";
import Settings, {getUserInfo} from "./components/settings";
import SdfLotus from "./components/sdfLotus";
import LegalNotice from "./components/legalNotice";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path:"/",
        element:<Motor/>,
        loader: async () => {
          const fileList = await getFilesInfo();
          return { fileList: fileList.fileList.fileList };
        }
      },
      {
        path:"/file",
        element:<File/>,
        loader: getFilesInfo
      },
      {
        path:"/sdfLotus",
        element:<SdfLotus/>,
        loader: getFilesInfo
      },
      {
        path:"/sign-in",
        element:<SignIn/>,
        loader: checkToken
      },
      {
        path:"/sign-up",
        element:<SignUp/>,
        loader: checkToken
      },
      {
        path:"/profile",
        element:<Profile/>,
        loader: getUserInfoAndFiles
      },
      {
        path:"/profile/settings",
        element:<Settings/>,
        loader: getUserInfo
      },
      {
        path:"/preview",
        element:<Preview/>,
        loader: getFile
      },
      {
        path:"/legal",
        element:<LegalNotice/>
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
