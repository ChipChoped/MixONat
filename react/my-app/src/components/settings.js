import { useLoaderData } from "react-router-dom";
import 'alertifyjs/build/css/alertify.css';
import "../styles/settings.scss";
import "../styles/error.scss";
import Cookies from 'universal-cookie';
import alertify from "alertifyjs";
import {useEffect, useState} from "react";


function Settings()
{
    const { user } = useLoaderData()
    const { status } = useLoaderData()
    const { message } = useLoaderData()

    const [firstName, setFirstName] = useState(user.first_name)
    const [lastName, setLastName] = useState(user.last_name)
    const [email, setEmail] = useState(user.email)
    const [emailConfirmation, setEmailConfirmation] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')

    const [firstNameError, setFirstNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [emailConfirmationError, setEmailConfirmationError] = useState('')
    const [currentPasswordError, setCurrentPasswordError] = useState('')
    const [newPasswordError, setNewPasswordError] = useState('')
    const [newPasswordConfirmationError, setNewPasswordConfirmationError] = useState('')

    const [modifyIdentity, setModifyIdentity] = useState(false)
    const [modifyEmail, setModifyEmail] = useState(false)
    const [modifyPassword, setModifyPassword] = useState(false)
    const [deleteAccount, setDeleteAccount] = useState(false)

    const cookies = new Cookies();

    const deleteAccountButton = () => {
        alertify.confirm("Confirm", "Are you sure to continue ? You will delete your account permanently with all the files you uploaded.",

            function () {
                setDeleteAccount(true)
            },
            function () {
            });
    }

    useEffect(() => {
        if (modifyIdentity) {
            async function fetchData() {
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + cookies.get("authentication_token")
                    },
                    body: JSON.stringify(
                        {
                            "first-name": firstName,
                            "last-name": lastName
                        }
                    )
                };

                fetch("http://localhost:9000/user/update/identity", requestOptions).then((response) => {
                    if (response.status === 204) {
                        alertify.success('Identity modified successfully.')
                    } else if (response.status === 400) {
                        response.json().then((json) => {
                            setFirstNameError(json.firstName)
                            setLastNameError(json.lastName)
                        })
                    } else {
                        alertify.error('Error, problem to modify the identity on the database.')
                    }
                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                    setModifyIdentity(false)
                })
            }

            fetchData().then(() => {})
        }
    }, [modifyIdentity])

    useEffect(() => {
        if (modifyEmail) {
            async function fetchData() {
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + cookies.get("authentication_token")
                    },
                    body: JSON.stringify(
                        {
                            "email": email,
                            "email-confirmation": emailConfirmation
                        }
                    )
                };

                fetch("http://localhost:9000/user/update/email", requestOptions).then((response) => {
                    if (response.status === 204) {
                        alertify.success('Email modified successfully.')
                    } else if (response.status === 400) {
                        response.json().then((json) => {
                            setEmailError(json.email)
                            setEmailConfirmationError(json.sameEmail)
                        })
                    } else {
                        alertify.error('Error, problem to modify the email on the database.')
                    }
                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                    setModifyEmail(false)
                })
            }

            fetchData().then(() => {})
        }
    }, [modifyEmail])

    useEffect(() => {
        if (modifyPassword) {
            async function fetchData() {
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + cookies.get("authentication_token")
                    },
                    body: JSON.stringify(
                        {
                            "current-password": currentPassword,
                            "new-password": newPassword,
                            "new-password-confirmation": newPasswordConfirmation
                        }
                    )
                };

                fetch("http://localhost:9000/user/update/password", requestOptions).then((response) => {
                    if (response.status === 204) {
                        alertify.success('Password modified successfully.')

                        setCurrentPasswordError('')
                        setNewPasswordError('')
                        setNewPasswordConfirmationError('')
                    } else if (response.status === 400) {
                        response.json().then((json) => {
                            setCurrentPasswordError(json.currentPassword)

                            if (json.newPassword !== undefined) {
                                setNewPasswordError(json.newPassword)
                            } else {
                                setNewPasswordError(json.differentPassword)
                            }

                            if (json.newPasswordConfirmation !== undefined) {
                                setNewPasswordConfirmationError(json.newPasswordConfirmation)
                            } else {
                                setNewPasswordConfirmationError(json.samePassword)
                            }
                        })
                    } else if (response.status === 403) {
                        response.json().then((json) => {
                            setCurrentPasswordError(json.message)
                            setNewPasswordError('')
                            setNewPasswordConfirmationError('')
                        })
                    } else {
                        alertify.error('Error, problem to modify the password on the database.')
                    }
                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                    setCurrentPassword('')
                    setNewPassword('')
                    setNewPasswordConfirmation('')

                    setModifyPassword(false)
                })
            }

            fetchData().then(() => {})
        }
    }, [modifyPassword])

    useEffect(() => {
        if (deleteAccount) {
            async function fetchData() {
                const requestOptions = {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + cookies.get("authentication_token")
                    }
                };

                fetch("http://localhost:9000/user", requestOptions).then((response) => {
                    if (response.status === 204) {
                        cookies.remove("authentication_token", { path: '/' })
                        window.location.href = "/"
                    } else {
                        alertify.error('Error, problem to delete the account on the database.')
                    }
                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                    setDeleteAccount(false)
                })
            }

            fetchData().then(() => {})
        }
    }, [deleteAccount])

    if (user) {
        return (
            <div className='settings-container'>
                <div className='settings-card'>
                    <h1> Settings </h1>
                    <div className='settings-sub-card'>
                        <span>Change first and last name</span>
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
                        <div className='modify-button'>
                            <button type="submit" onClick={() => {setModifyIdentity(true)}}>Save</button>
                        </div>
                    </div>
                    <div className='settings-sub-card'>
                        <span>Change email address</span>
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
                        <div className='modify-button'>
                            <button type="submit" onClick={() => {setModifyEmail(true)}}>Save</button>
                        </div>
                    </div>
                    <div className='settings-sub-card'>
                        <span>Change password</span>
                        <div>
                            <label htmlFor='current-password'>Current password</label>
                            <div>
                                <input type="password" id="current-password" value={currentPassword} onChange={(e) => {setCurrentPassword(e.target.value)}}/>
                                {currentPasswordError !== ''
                                    ? <p className='error-message'>{currentPasswordError}</p>
                                    : null}
                            </div>
                        </div>
                        <div>
                            <label htmlFor='new-password'>New password</label>
                            <div>
                                <input type="password" id="new-password" value={newPassword} onChange={(e) => {setNewPassword(e.target.value)}}/>
                                {newPasswordError !== ''
                                    ? <p className='error-message'>{newPasswordError}</p>
                                    : null}
                            </div>
                        </div>
                        <div>
                            <label htmlFor='new-password-confirmation'>New password confirmation</label>
                            <div>
                                <input type="password" id="new-password-confirmation" value={newPasswordConfirmation} onChange={(e) => {setNewPasswordConfirmation(e.target.value)}}/>
                                {newPasswordConfirmationError !== ''
                                    ? <p className='error-message'>{newPasswordConfirmationError}</p>
                                    : null}
                            </div>
                        </div>
                        <div className='modify-button'>
                            <button type="submit" onClick={() => {setModifyPassword(true)}}>Save</button>
                        </div>
                    </div>
                    <div className='settings-sub-card'>
                        <span>Delete account</span>
                        <div className='delete-button'>
                            <button type="submit" onClick={() => {deleteAccountButton()}}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className='error-container'>
                <h1> Error { status } </h1>
                <h2> { message } </h2>
            </div>
        )
    }
}

export async function getUserInfo()
{
    const cookies = new Cookies();

    if (!cookies.get("authentication_token")) {
        window.location.href = "/sign-in";
    } else {
        const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + cookies.get("authentication_token") }
        }

        const response = await fetch("http://localhost:9000/user", requestOptions)
        const json = await response.json()

        if (response.status === 200) {
            return { user: json }
        } else {
            return { status: response.status, message: json.message }
        }
    }
}

export default Settings;
