import { FileLoader } from "./fileLoader";
import "../styles/fileLoaderList.scss"

export function FileLoaderList({sdfList,useSdfList,setSDF,setSdfIsLoading,setSpectrum,setSpectrumIsLoading,setDEPT135,setDept135IsLoading,setDEPT90,setDept90IsLoading,sdfIsSetPointer,sdfIsSet,c13IsSetPointer,c13IsSet , dept135IsSet,dept135IsSetPointer ,sendcheckRequest,setTitle,titles,useRmnList,rmnList,hasFile})
{
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }

    //  A function called when user removes files where we change the useState of files
    function deleteFile(filetype)
    {
      switch(filetype)
      {
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
          break
      }
    }

    function chooseSdfFile(name)
    {
      if(name === "")
      {
        setSDF(undefined)
        sdfIsSetPointer(false)
        setDEPT135(undefined)
        setDEPT90(undefined)
      }
      else
      {
        setSDF(name)
        sdfIsSetPointer(true)
      }
    }

    function chooseRmnFile(name)
    {
      if(name === "")
      {
        setSpectrum(undefined)
        c13IsSetPointer(false)
        //sdfIsSetPointer(false)
        setDEPT135(undefined)
        setDEPT90(undefined)
      }
      else
      {
        setSpectrum(name)
        c13IsSetPointer(true)
        //sIsSetPointer(true)
      }
    }

    return (
    <div className={hasFile ? "file-loader-list" : "file-loader-list-without-file"}>
        {useSdfList
            ? <select className={hasFile ? "file-loader-select" : "file-loader-select-without-file"} onChange={(e) => {chooseSdfFile(e.target.value)}}>
                <option value="">-- Please choose a sdf file --</option>
                { sdfList.sdfList.map((sdf) => (
                    <option value={ sdf.uuid } key={ sdf.uuid }>
                        { sdf.name + " | " + new Date(sdf.added_at).toLocaleDateString(undefined, options)
                            + " | Author: " + sdf.author + " | Added by: " + sdf.added_by_name }
                    </option>)) }
            </select>
          : <FileLoader filetype ="sdf" setFile={setSDF} setFileIsLoading={setSdfIsLoading} sdfIsSetPointer ={sdfIsSetPointer}dept135IsSetPointer = {dept135IsSetPointer} deleteFile={deleteFile} sendcheckRequest={sendcheckRequest} setTitle={setTitle} titles={titles}/>}
        
        
        {useRmnList 
            ? <select className={hasFile ? "file-loader-select" : "file-loader-select-without-file"} onChange={(e) => {chooseRmnFile(e.target.value)}}>
                <option value="">-- Please choose a rmn file --</option>
                { rmnList.rmnList.map((rmn) => (
                    <option value={ rmn.uuid } key={ rmn.uuid }>
                        { rmn.name + " | " + new Date(rmn.added_at).toLocaleDateString(undefined, options)
                            + " | Author: " + rmn.author + " | Added by: " + rmn.added_by_name }
                    </option>)) }
            </select>
          :<FileLoader filetype ="spectrum" setFile={setSpectrum} setFileIsLoading={setSpectrumIsLoading} c13IsSetPointer = {c13IsSetPointer} dept135IsSetPointer ={dept135IsSetPointer} deleteFile ={deleteFile} sendcheckRequest={sendcheckRequest} setTitle={setTitle} titles={titles}/>}
       
        { sdfIsSet && c13IsSet ? 
        <>
            <FileLoader filetype ="dept135" setFile = {setDEPT135} setFileIsLoading={setDept135IsLoading} dept135IsSetPointer={dept135IsSetPointer} deleteFile={deleteFile} sendcheckRequest={sendcheckRequest} setTitle={setTitle} titles={titles}/>
        </>
        : <></> 
        } 

        {
           sdfIsSet && c13IsSet && dept135IsSet  ?
           <>
                <FileLoader filetype ="dept90" setFile = {setDEPT90} setFileIsLoading={setDept90IsLoading} dept135IsSetPointer={dept135IsSetPointer} deleteFile={deleteFile} sendcheckRequest={sendcheckRequest} setTitle={setTitle} titles={titles}/> 
           </>
           :<></>
        }
    </div>
    )
}