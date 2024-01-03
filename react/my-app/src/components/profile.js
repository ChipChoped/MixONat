import { useLoaderData, useNavigate } from "react-router-dom";
import 'alertifyjs/build/css/alertify.css';
import "../styles/profile.scss";
import "../styles/file.scss";
import "../styles/error.scss";
import Cookies from 'universal-cookie';
import red_cross from "../assets/img/red-cross.png";
import alertify from "alertifyjs";
import {useEffect, useState} from "react";


function Profile()
{
    const [deleteFileId, setDeleteFileId] = useState(undefined)
    const [deleteFile, setDeleteFile] = useState(false)

    const { user } = useLoaderData()
    const { fileList } = useLoaderData()
    const { ownProfile } = useLoaderData()
    const { status } = useLoaderData()
    const { message } = useLoaderData()

    const options = { year: 'numeric', month: '2-digit', day: '2-digit'}

    const navigate = useNavigate();

    const cookies = new Cookies();

    const deleteFileButton = (deleteFileId) => {
        alertify.confirm("Confirm", "Are you sure to continue ? You will delete this file.",

            function () {
                setDeleteFileId(deleteFileId)
                setDeleteFile(true)
            },
            function () {
            });
    }

    useEffect(() => {
        if (deleteFile) {
            async function fetchData() {
                // Put in the request the name of the file which going to be deleted

                const requestOptions = {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + cookies.get("authentication_token")
                    },
                    body: JSON.stringify({id: deleteFileId})
                };

                // Send it to Spring server
                fetch("http://localhost:9000/file", requestOptions).then((response) => {
                    if (response.status === 204) {
                        navigate("/file")
                    } else {
                        alertify.error('Error, problem to delete the file on the database.')
                    }
                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                    setDeleteFile(undefined)
                })
            }

            fetchData()
        }
    }, [deleteFile])

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
                <div className='file-list'>
                    <span>Added files</span>
                    {fileList.map((file) => (
                        <div className={ownProfile ? 'file-own-true' : 'file-own-false'}>
                            <div className='file-info' key={file.id}>
                                <div className='file-type'>
                                    <span> {file.type} </span>
                                </div>
                                <div className='file-name-date'>
                                <span>
                                    <a href={"/preview?f=" + file.id}>
                                        {file.name}
                                    </a>
                                </span>
                                    <span> {new Date(file.added_at).toLocaleDateString(undefined, options)} </span>
                                </div>
                                <div className='file-attribution'>
                                    <span> Author: <b> {file.author} </b> </span>
                                    <span> Added by:&nbsp;
                                        <a href={"/profile?u=" + file.added_by} target="_blank" rel="noreferrer">
                                        {file.added_by_name}
                                    </a>
                                </span>
                                </div>
                            </div>
                            {ownProfile
                                ? <div className='file-input-image'>
                                    <input type="image" src={red_cross} onClick={() => {
                                        deleteFileButton(file.id)
                                    }}/>
                                </div>
                                : null
                            }
                        </div>))}
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

export async function getUserInfo()
{
    const queryParams = new URLSearchParams(window.location.search)
    let id = queryParams.get("u")

    const cookies = new Cookies();

    if (id === null) {

        if (cookies.get('authentication_token')) {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                           'Authorization': 'Bearer ' + cookies.get("authentication_token") }
            };

            const response = await fetch("http://localhost:9000/user", requestOptions);
            const json = await response.json();

            if (response.status === 200) {
                id = json.id

                const requestOptions = {
                    method: 'GET'
                };

                const response_ = await fetch("http://localhost:9000/file/list/user/" + id, requestOptions);
                const json_ = await response_.json();

                if (response_.status === 200) {
                    return { user: json, fileList: json_.fileList, ownProfile: true }
                }
                else {
                    return { user: undefined, fileList: undefined, status: response_.status, message: json_.message }
                }
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
        id = json.id

        const requestOptions = {
            method: 'GET'
        };

        const response_ = await fetch("http://localhost:9000/file/list/user/" + id, requestOptions);
        const json_ = await response_.json();

        if (response_.status === 200) {
            if (cookies.get('authentication_token')) {
                const requestOptions = {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + cookies.get("authentication_token") }
                }

                const response__ = await fetch("http://localhost:9000/user/id", requestOptions);
                const json__ = await response__.json();

                if (response__.status === 200) {
                    if (json__.id === json.id) {
                        return { user: json, fileList: json_.fileList, ownProfile: true }
                    }
                    else {
                        return { user: json, fileList: json_.fileList, ownProfile: false }
                    }
                }
            }

            return { user: json, fileList: json_.fileList, ownProfile: false }
        }
        else {
            return { user: undefined, fileList: undefined, status: response_.status, message: json_.message }
        }
    }
    else {
        return { user: undefined, fileList: undefined, status: response.status, message: json.message }
    }
}

export default Profile;
