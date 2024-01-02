import {FileLoader} from "./fileLoader";
import "../styles/fileLoaderList.scss"

export function FileLoaderList({
                                   fileList,
                                   useSdfList, useSpectrumList,
                                   useDept135List, useDept90List,
                                   setSDF, setSdfIsLoading,
                                   setSpectrum, setSpectrumIsLoading,
                                   setDEPT135, setDept135IsLoading,
                                   setDEPT90, setDept90IsLoading,
                                   sdfIsSetPointer, sdfIsSet,
                                   c13IsSetPointer, c13IsSet,
                                   dept135IsSet, dept135IsSetPointer,
                                   dept90IsSet, dept90IsSetPointer,
                                   sendCheckRequest, setTitle, titles,
                                   hasFile
                               }) {
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'}

    //  A function called when user removes files where we change the useState of files
    function deleteFile(filetype) {
        switch (filetype) {
            case 'sdf':
                setSDF(undefined)
                sdfIsSetPointer(false)
                setDEPT135(undefined)
                setDEPT90(undefined)
                break
            case 'spectrum':
                setSpectrum(undefined)
                c13IsSetPointer(false)
                setDEPT135(undefined)
                setDEPT90(undefined)
                break
            case 'dept135':
                setDEPT135(undefined)
                dept135IsSetPointer(false)
                break;
            default :
                setDEPT90(undefined)
                dept90IsSetPointer(false)
                break
        }
    }

    function chooseSdfFile(name) {
        if (name === "") {
            setSDF(undefined)
            sdfIsSetPointer(false)
            setDEPT135(undefined)
            setDEPT90(undefined)
        } else {
            setSDF(name)
            sdfIsSetPointer(true)
        }
    }

    function chooseRmnFile(name) {
        if (name === "") {
            setSpectrum(undefined)
            c13IsSetPointer(false)
            //sdfIsSetPointer(false)
            setDEPT135(undefined)
            setDEPT90(undefined)
        } else {
            setSpectrum(name)
            c13IsSetPointer(true)
            //sIsSetPointer(true)
        }
    }

    function chooseDept135File(name) {
        if (name === "") {
            setDEPT135(undefined)
            dept135IsSetPointer(false)
        } else {
            setDEPT135(name)
            dept135IsSetPointer(true)
        }
    }

    function chooseDept90File(name) {
        if (name === "") {
            setDEPT90(undefined)
            dept90IsSetPointer(false)
        } else {
            setDEPT90(name)
            dept90IsSetPointer(true)
        }
    }

    return (
        <div className={hasFile ? "file-loader-list" : "file-loader-list-without-file"}>
                {useSdfList
                    ? <select className={hasFile ? "file-loader-select" : "file-loader-select-without-file"}
                              onChange={(e) => {
                                  chooseSdfFile(e.target.value)
                              }}>
                        <option value="">-- Please choose a sdf file --</option>
                        {fileList.filter(file => file.type === "SDF").map((sdf) => (
                            <option value={sdf.id} key={sdf.id}>
                                {sdf.name + " | " + new Date(sdf.added_at).toLocaleDateString(undefined, options)
                                    + " | Author: " + sdf.author + " | Added by: " + sdf.added_by_name}
                            </option>))}
                    </select>
                    : <FileLoader filetype="sdf" setFile={setSDF} setFileIsLoading={setSdfIsLoading}
                                  sdfIsSetPointer={sdfIsSetPointer} dept135IsSetPointer={dept135IsSetPointer}
                                  deleteFile={deleteFile} sendcheckRequest={sendCheckRequest} setTitle={setTitle}
                                  titles={titles}/>}

            {useSpectrumList
                ? <select className={hasFile ? "file-loader-select" : "file-loader-select-without-file"}
                          onChange={(e) => {
                              chooseRmnFile(e.target.value)
                          }}>
                    <option value="">-- Please choose a rmn file --</option>
                    {fileList.filter(file => file.type === "SPECTRUM").map((rmn) => (
                        <option value={rmn.id} key={rmn.id}>
                            {rmn.name + " | " + new Date(rmn.added_at).toLocaleDateString(undefined, options)
                                + " | Author: " + rmn.author + " | Added by: " + rmn.added_by_name}
                        </option>))}
                </select>
                : <FileLoader filetype="spectrum" setFile={setSpectrum} setFileIsLoading={setSpectrumIsLoading}
                              c13IsSetPointer={c13IsSetPointer} dept135IsSetPointer={dept135IsSetPointer}
                              deleteFile={deleteFile} sendcheckRequest={sendCheckRequest} setTitle={setTitle}
                              titles={titles}/>}

            {useDept135List
                ? <select className={hasFile ? "file-loader-select" : "file-loader-select-without-file"}
                          onChange={(e) => {
                              chooseDept135File(e.target.value)
                          }}>
                    <option value="">-- Please choose a dept135 file --</option>
                    {fileList.filter(file => file.type === "DEPT135").map((dept135) => (
                        <option value={dept135.id} key={dept135.id}>
                            {dept135.name + " | " + new Date(dept135.added_at).toLocaleDateString(undefined, options)
                                + " | Author: " + dept135.author + " | Added by: " + dept135.added_by_name}
                        </option>))}
                </select>
                : <FileLoader filetype="dept135" setFile={setDEPT135} setFileIsLoading={setDept135IsLoading}
                              dept135IsSetPointer={dept135IsSetPointer} deleteFile={deleteFile}
                              sendcheckRequest={sendCheckRequest} setTitle={setTitle} titles={titles}/>}

            {useDept90List
                ? <select className={hasFile ? "file-loader-select" : "file-loader-select-without-file"}
                            onChange={(e) => {
                                chooseDept90File(e.target.value)
                            }}>
                        <option value="">-- Please choose a dept90 file --</option>
                        {fileList.filter(file => file.type === "DEPT90").map((dept90) => (
                            <option value={dept90.id} key={dept90.id}>
                                {dept90.name + " | " + new Date(dept90.added_at).toLocaleDateString(undefined, options)
                                    + " | Author: " + dept90.author + " | Added by: " + dept90.added_by_name}
                            </option>))}
                    </select>
                : <FileLoader filetype="dept90" setFile={setDEPT90} setFileIsLoading={setDept90IsLoading}
                                dept135IsSetPointer={dept135IsSetPointer} deleteFile={deleteFile}
                                sendcheckRequest={sendCheckRequest} setTitle={setTitle} titles={titles}/>}
        </div>
    )
}