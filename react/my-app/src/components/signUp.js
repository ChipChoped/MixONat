import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import 'alertifyjs/build/css/alertify.css';
import "../styles/signUp.scss";
import Cookies from "universal-cookie";
import {jwtDecode} from "jwt-decode";


function SignUp() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [emailConfirmation, setEmailConfirmation] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [consent, setConsent] = useState(false)

    const [firstNameError, setFirstNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [emailConfirmationError, setEmailConfirmationError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordConfirmationError, setPasswordConfirmationError] = useState('')
    const [consentError, setConsentError] = useState('')

    const [errorMessage, setErrorMessage] = useState('')
    const [signingUp, setSigningUp] = useState(false)

    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(() => {
        if(signingUp) {
            async function signUp() {
                const requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            "first-name": firstName,
                            "last-name": lastName,
                            "email": email,
                            "email-confirmation": emailConfirmation,
                            "password": password,
                            "password-confirmation": passwordConfirmation,
                            "consent": consent
                        }
                    )
                };

                // Send request to Spring server
                fetch("http://localhost:9000/user/sign-up", requestOptions).then((response) => {
                    response.json().then((json) => {
                        if (response.status === 201) {
                            const decodedToken = jwtDecode(json.token)

                            cookies.set('authentication_token', json.token, {
                                expires: new Date(decodedToken.exp * 1000)
                            });

                            window.location.href = "/"
                        }
                        else if (response.status === 400) {
                            setErrorMessage("Please complete correctly the form")
                            setFirstNameError(json.firstName)
                            setLastNameError(json.lastName)
                            setEmailError(json.email)
                            setEmailConfirmationError(json.sameEmail)
                            setPasswordError(json.password)
                            setPasswordConfirmationError(json.samePassword)
                            setConsentError(json.consent)

                            document.getElementById("consent").checked = false
                            setConsent(false)
                        }
                        else if (response.status === 500) {
                            setErrorMessage("A server internal error occurred")

                            document.getElementById("checkbox").checked = false;
                            setConsent(false)
                        }
                        else {
                            setErrorMessage("An unknown error occurred. Please try again later.")

                            document.getElementById("checkbox").checked = false;
                            setConsent(false)
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                    setSigningUp(false)
                })
            }

            signUp()
        }
    },[signingUp])

    return(
        <div className='sign-up-container'>
            <div className='sign-up-block'>
                <h2>Sign up to MixONat</h2>
                {errorMessage !== ''
                    ? <p className='error-message'>{errorMessage}</p>
                    : null}
                <div>
                    <label htmlFor='first-name'>First name</label>
                    <div>
                        <input type="text" id="first-name" value={firstName} onChange={(e) => {setFirstName(e.target.value)}}/>
                        {firstNameError !== ''
                            ? <p className='error-message'>{firstNameError}</p>
                            : null}
                    </div>
                </div>
                <div>
                    <label htmlFor='last-name'>Last name</label>
                    <div>
                        <input type="text" id="last-name" value={lastName} onChange={(e) => {setLastName(e.target.value)}}/>
                        {lastNameError !== ''
                            ? <p className='error-message'>{lastNameError}</p>
                            : null}
                    </div>
                </div>
                <div>
                    <label htmlFor='email'>Email address</label>
                    <div>
                        <input type="email" id="email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                        {emailError !== ''
                            ? <p className='error-message'>{emailError}</p>
                            : null}
                    </div>
                </div>
                <div>
                    <label htmlFor='email-confirmation'>Email address confirmation</label>
                    <div>
                        <input type="email" id="email-confirmation" value={emailConfirmation} onChange={(e) => {setEmailConfirmation(e.target.value)}}/>
                        {emailConfirmationError !== ''
                            ? <p className='error-message'>{emailConfirmationError}</p>
                            : null}
                    </div>
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <div>
                        <input type="password" id="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                        {passwordError !== ''
                            ? <p className='error-message'>{passwordError}</p>
                            : null}
                    </div>
                </div>
                <div>
                    <label htmlFor='password-confirmation'>Password confirmation</label>
                    <div>
                        <input type="password" id="password-confirmation" value={passwordConfirmation} onChange={(e) => {setPasswordConfirmation(e.target.value)}}/>
                        {passwordConfirmationError !== ''
                            ? <p className='error-message'>{passwordConfirmationError}</p>
                            : null}
                    </div>
                </div>
                <div className='consent'>
                    <input type='checkbox' id='consent' value={consent} onChange={(e) => {
                        if (consent === false)
                            setConsent(true)
                        else
                            setConsent(false)
                    }}/>
                    <label for='consent'>I agree to let MixONat store my personnel information for the sole purpose
                        of the creation of my user account and to cite my name for the works that I might share.</label>
                </div>
                {passwordConfirmationError !== ''
                    ? <div className='consent'><p className='error-message'>{consentError}</p></div>
                    : null}
                <div className='sign-up-button'>
                    <button type="submit" onClick={() => {setSigningUp(true)}}> Sign Up </button>
                </div>
            </div>
        </div>
    )
}

export default SignUp;
