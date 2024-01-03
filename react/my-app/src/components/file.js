import {useEffect, useState} from 'react';
import {useLoaderData, useNavigate} from "react-router-dom";
import alertify from 'alertifyjs';
import ClipLoader from "react-spinners/ClipLoader";
import 'alertifyjs/build/css/alertify.css';
import "../styles/file.scss";
import red_cross from "../assets/img/red-cross.png";
import Cookies from "universal-cookie";


function File() {
    const [name, setName] = useState('')
    const [type, setType] = useState('SDF')
    const [file, setFile] = useState(undefined)
    const [author, setAuthor] = useState('')
    const [fileIsLoading, setFileIsLoading] = useState(false)
    const [upload, setUpload] = useState(false)
    const [deleteFileId, setDeleteFileId] = useState(undefined)
    const [deleteFile, setDeleteFile] = useState(false)
    const navigate = useNavigate();

    const options = {year: 'numeric', month: '2-digit', day: '2-digit'}

    const { fileList, userId } = useLoaderData()

    const cookies = new Cookies();

    const readFile = (file) => {
        if (file === undefined) {
            setFileIsLoading(false)
            return
        }

        try {
            const reader = new FileReader();
            reader.onload = (res) => {
                setFileIsLoading(false)
                setFile(res.target.result)
                alertify.success(`The file has been loaded.`);
            };

            reader.readAsText(file);
        } catch (error) {
            alertify.error('Error, try again');
        }
    }

    const checkFile = () => {
        if (file !== undefined && name !== '') {
            setUpload(true)
        } else if (file !== undefined) {
            alertify.error('Error, you have to choose a file to upload.')
        } else {
            alertify.error('Error, you have to choose a name for your file.')
        }
    }

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
        if (upload) {
            setFileIsLoading(true)

            async function fetchData() {
                // Put in the request the file and its name

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + cookies.get("authentication_token")
                    },
                    body: JSON.stringify({name: name, type: type, file: file, author: author})
                };

                // Send it to Spring server
                fetch("http://localhost:9000/file", requestOptions).then((response) => {
                    if (response.status === 201) {
                        navigate("/file")
                    } else {
                        alertify.error('Error, problem to upload the file on the database.')
                    }
                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                    setFileIsLoading(false);
                    setUpload(false)
                })

                // At the end, pass the loading parameter to false
            }

            fetchData()
        }
    }, [upload])

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

    return (
        <div className='file-container'>
            <div className='file-upload'>
                <span>ADD FILE IN THE DATABASE</span>
                <div>
                    <label htmlFor='fileFile'>FILE</label>
                    <input type="file" id="fileFile" onChange={(e) => {
                        setFileIsLoading(true);
                        readFile(e.target.files[0])
                    }}></input>
                </div>
                <div>
                    <label htmlFor='fileName'>FILE NAME</label>
                    <input type="text" id="fileName" value={name} placeholder="Enter the name of the file"
                           onChange={(e) => {
                               setName(e.target.value)
                           }}></input>
                </div>
                <div>
                    <label htmlFor='fileType'>FILE TYPE</label>
                    <select id="fileType" value={type} onChange={(e) => {
                        setType(e.target.value)
                    }}>
                        <option value="SDF">SDF</option>
                        <option value="SPECTRUM">Spectrum</option>
                        <option value="DEPT90">Dept90</option>
                        <option value="DEPT135">Dept135</option>
                    </select>
                </div>
                <div>
                    <label htmlFor='fileAuthor'>FILE AUTHOR</label>
                    <input type="text" id="fileAuthor" value={author} placeholder="Enter the author of the file"
                           onChange={(e) => {
                               setAuthor(e.target.value)
                           }}></input>
                </div>
                <div className='file-button'>
                    {fileIsLoading
                        ? <button>
                            <ClipLoader className="file-loader" color={"#ffffff"}/>
                        </button>
                        : <button onClick={() => {
                            checkFile()
                        }}>Add to the database</button>}
                </div>
            </div>

            <div className='file-list'>
                <span>All FILES IN THE DATABASE</span>
                {fileList.fileList.map((file) => (
                    <div className='file'>
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
                        {console.log(file.added_by)}
                        {console.log(userId.id)}
                        {file.added_by === userId.id
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

export async function getFilesInfo() {
    const requestOptions = {
        method: 'GET'
    };

    // Send request to Spring server

    const response = await fetch("http://localhost:9000/file/list", requestOptions);
    const fileList = await response.json();

    let cookies = new Cookies();

    const requestOptions_ = {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + cookies.get("authentication_token") }
    };

    const response_ = await fetch("http://localhost:9000/user/id", requestOptions_);
    const userId = await response_.json();

    return { fileList: fileList, userId: userId };
}

export default File;
