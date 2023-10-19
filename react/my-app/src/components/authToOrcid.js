// import React  from 'react';
// import {
//   BrowserRouter as Router,
//   Route,
// } from 'react-router-dom';

// import { Auth, useAuthDispatch, useAuthState } from 'react-orcid-auth';

// // Define your environment variables from your ORCID account and your crispy-sniffle URL
// const ORCID_URL = '';
// const ORCID_CLIENT_ID = '';
// const ORCID_REDIRECT_URI = '';
// const CRISPY_SNIFFLE_API = '';

// const App = () => {
//   /* Add parent component <Auth> to the routes where you gonna need ORCID infos
//    * and pass to it environment variables and history as props
//    *
//    * Add redirect route /oauth
//    * and pass to it environment variables and history as props
//    */
//   return <Router>
//     <Route
//       exact
//       path="/"
//       render={(props) =>
//         <Auth history={props.history}
//               orcidUrl={ORCID_URL}
//               orcidRedirectUri={ORCID_REDIRECT_URI}
//               orcidClientId={ORCID_CLIENT_ID}
//               crispySniffleApi={ORCID_A24_API}>
//           <MyComponent {...props}/>
//         </Auth>
//       }
//     />
//     <Route
//       path="/oauth"
//       render={(props) =>
//         <Auth history={props.history}
//               orcidUrl={ORCID_URL}
//               orcidRedirectUri={ORCID_REDIRECT_URI}
//               orcidClientId={ORCID_CLIENT_ID}
//               crispySniffleApi={ORCID_A24_API}>
//           <section>Loading...</section>
//         </Auth>
//       }
//     />
//   </Router>;
// };

// const MyComponent = () => {
//   /*
//    * Retrieve state and dispatch methods with useAuthDispatch and useAuthState
//    * Don't forget to pass payload to functions
//    */
//   const dispatch = useAuthDispatch();
//   const state = useAuthState();
//   return (
//     <section className="container">
//       <h1>Welcome</h1>
//       <article>
//         <h2>Infos available</h2>
//         <p>{state.user?.firstName}</p>
//         <p>{state.user?.lastName}</p>
//         <p>{state.message}</p>
//         <div>
//           <h2>Methods available</h2>
//           <button onClick={() => dispatch({ type: 'SIGNUP', payload: true })}>Login with orcid</button>
//           <button onClick={() => dispatch({ type: 'LOGOUT', payload: true })}>Logout</button>
//         </div>
//       </article>
//     </section>);
// };