import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import 'alertifyjs/build/css/alertify.css';
import "../styles/signIn.scss";
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';


function SignIn()
{
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const [signingIn, setSigningIn] = useState(false)
    const [signUp, setSignUp] = useState(false)

    const navigate = useNavigate();

    const cookies = new Cookies();

    useEffect(() => {
        if(signingIn)
        {
            async function signIn()
            {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            "email": email,
                            "password": password
                        }
                    )
                };

                // Send request to Spring server
                fetch("http://localhost:9000/user/sign-in", requestOptions).then((response) => {
                    response.json().then((json) => {
                        if (response.status === 200) {
                            // Save token in a cookie
                            const decodedToken = jwtDecode(json.token)
                            cookies.set("authentication_token", json.token, {
                                expires: new Date(decodedToken.exp * 1000)
                            });

                            window.location.href = "/"
                        }
                        else if (response.status === 401) {
                            setErrorMessage(json.message)
                            setPassword('')
                        }
                        else if (response.status === 500){
                            setErrorMessage(json.message)
                        }
                        else {
                            setErrorMessage("An unknown error occurred. Please try again later.")
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                    setSigningIn(false)
                })
            }

            signIn()
        }
    },[signingIn])

    useEffect(() => {
        if (signUp) {
            navigate("/sign-up")
        }
    }, [signUp])

    return(
        <div className='sign-in-container'>
            <div className='sign-in-block'>
                <h2>Sign in to MixONat</h2>
                {errorMessage !== ''
                    ? <p className='error-message'>{errorMessage}</p>
                    : null}
                <div>
                    <label htmlFor='email'>Email address</label>
                    <input type="email" id="email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                </div>
                <div className='sign-in-button'>
                    <button type="submit" onClick={() => {
                        setSigningIn(true)
                        }}
                    > Sign In </button>
                </div>
                <p className='sign-up'> No account yet? Sign up <button onClick={() => {setSignUp(true)}}><b><em>here</em></b></button>!</p>
            </div>
            <!-- <script src="./orcid-widget.js"></script> -->
            <!-- <div id="orcidWidget" data-size='lg' data-clientid='APP-34IBF14LOTOGDJZZ' data-env='production' data-scopes='/activities/update' data-redirecturi='https://orcid.github.io/orcid-auth-widget/widget.html'></div> -->
        </div>
    )
}

export default SignIn;
