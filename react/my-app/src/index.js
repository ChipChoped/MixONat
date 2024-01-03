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
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import Profile, {getUserInfo} from "./components/profile";
import Preview, {getFile} from "./components/preview";

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
        loader: getUserInfo
      },
      {
        path:"/preview",
        element:<Preview/>,
        loader: getFile
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
