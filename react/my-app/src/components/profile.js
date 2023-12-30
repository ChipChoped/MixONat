import { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from "react-router-dom";
import 'alertifyjs/build/css/alertify.css';
import "../styles/profile.scss";
import "../styles/error.scss";
import Cookies from 'universal-cookie';


function Profile()
{
    const { user } = useLoaderData()
    const { status } = useLoaderData()
    const { message } = useLoaderData()

    const options = { year: 'numeric', month: '2-digit', day: '2-digit'}

    const navigate = useNavigate();

    const cookies = new Cookies();

    if (user !== undefined) {
        return (
            <div className='profile-container'>
                <div className='profile-card'>
                    <span> Profile </span>
                    <div>
                        <h3> { user.first_name } { user.last_name } </h3>
                        <p> Joined { new Date(user.created_at).toLocaleDateString(undefined, options) } </p>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className='error-container'>
                <h1> Error { status } </h1>
                <p> { message } </p>
            </div>
        )
    }
}

export async function getUser()
{
    const queryParams = new URLSearchParams(window.location.search)
    let id = queryParams.get("u")

    if (id === null) {
        const cookies = new Cookies();

        if (cookies.get('authentication_token')) {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                           'Authorization': 'Bearer ' + cookies.get("authentication_token") }
            };

            const response = await fetch("http://localhost:9000/user/id", requestOptions);
            const json = await response.json();

            if (response.status === 200) {
                id = json.id
            }
            else {
                return { user: undefined, status: response.status, message: json.message }
            }
        }
        else {
            return { user: undefined, status: 401, message: "Unauthorized access. You need to be signed in to view your profile." }
        }
    }

    const requestOptions = {
        method: 'GET'
    };

    const response = await fetch("http://localhost:9000/user/" + id, requestOptions);
    const json = await response.json();

    if (response.status === 200) {
        return { user: json }
    }
    else {
        return { user: undefined, status: response.status, message: json.message }
    }
}

export default Profile;
