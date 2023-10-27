import { useEffect, useState } from 'react';
import { MoleculesList } from './moleculesList';
import { FileLoaderList } from './fileLoaderList';
import ClipLoader from "react-spinners/ClipLoader";
import { Loading } from './loading';
import alertify from 'alertifyjs';
import { Parameters } from './parameters';
import { Molecule } from './molecule';
import { Save } from '../utils/save';
import { useLoaderData } from "react-router-dom";
import 'alertifyjs/build/css/alertify.css';
import '../styles/rmnMotor.scss';

function RmnMotor()
{
  /*****************/
  /*     STATE     */
  /*****************/

  // Parameters for files (SDF, Spectrum, DEPT135 and DEPT90)

  const [sdf ,setSDF] = useState()
  const [sdfIsLoading, setSdfIsLoading] = useState(false)
  const [spectrum,setSpectrum] = useState()
  const [spectrumIsLoading, setSpectrumIsLoading] = useState(false)
  const [dept135,setDEPT135] = useState()
  const [dept135IsLoading, setDept135IsLoading] = useState(false)
  const [dept90,setDEPT90] = useState()
  const [dept90IsLoading, setDept90IsLoading] = useState(false)
  const [sdfIsSet,sdfIsSetPointer] = useState(false)
  const [c13IsSet,c13IsSetPointer] = useState(false)
  const [dept135IsSet,dept135IsSetPointer] = useState(false)

  const[params,setParams] = useState({
    'looseness_factor': '1.3', 
    'looseness_incr': true,                        
    'heuristic_sorting': false,
    'minimal_score': '0.0',
    'dept135_alignment': '0.02',
    'dept90_alignment': '0.02', 
    'carbon_equivalent': false,
    'molecular_weight': '', 
    'number_results': '50', 
    'number_results_page': '25'
    }
    );

  const { sdfData, rmnData } = useLoaderData();
  const {sdfList} = sdfData;
  const {rmnList} = rmnData;

  const [useSdfList,setUseSdfList] = useState(false)
  const [useRmnList,setUseRmnList] = useState(false)
  // Parameter to display the loader while data are fetched

  const [loading,setLoading] = useState(false)

  // Parameter to stock the results of the RMN motor

  const [data,setData] = useState()
  
  // Parameter to display the view for a particular molecule

  const [molecule_nbr,setMolecule_nbr] = useState(-1)

  //Parameter to stock deleted molecules

  const [deleteData,setDeleteData] = useState([])

  //Parameter to stock title of files

  const [titles,setTitle] = useState({
    'spectrum':null,
    'sdf':null,
    'dept135':null,
    'dept90':null
  })




  /*******************/
  /*     REQUEST     */
  /*******************/

  /***
   * 
   * If loading parameter is true, send a request to Spring server to get the results of the RMN motor
   * 
   ***/

  useEffect(() => {
    if(loading)
    {
        async function fetchData()
        {
                // Put in the request all files and parameters

                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sdf: sdf, spectrum: spectrum, dept135: dept135, dept90: dept90 , params : params, useSdfDatabase: useSdfList, useRmnDatabase: useRmnList})
                };

                // Send it to Spring server
                fetch("http://localhost:9000/rmn",requestOptions).then((response) => {
                  response.json().then((json) => {
                    // If there is a response, save results in the data parameter and display them in the console
                    setData(json);
                    console.log(json)
                  }).catch((err) => {
                      console.log(err);
                    }).finally(() => {
                      setLoading(false);
                      setSDF(undefined);
                      setSpectrum(undefined);
                      setDEPT135(undefined);
                      setDEPT90(undefined);
                      sdfIsSetPointer(false);
                      c13IsSetPointer(false);
                      dept135IsSetPointer(false);
                      setUseSdfList(false);
                      setUseRmnList(false);
                    })
                }).catch((err) => {
                  console.log(err);
                }).finally(() => {
                    setLoading(false);
                    setSDF(undefined);
                    setSpectrum(undefined);
                    setDEPT135(undefined);
                    setDEPT90(undefined);
                    sdfIsSetPointer(false);
                    c13IsSetPointer(false);
                    dept135IsSetPointer(false);
                    setUseSdfList(false);
                    setUseRmnList(false);
                  })

                // At the end, pass the loading parameter to false
        }
        
        fetchData()
    }
  },[loading])

   /***
   * 
   * Function to send a check request to spring server
   * 
   ***/ 

   function sendcheckRequest(filetype)
   {
       let fileToSend ;
       switch(filetype)
       {
         case 'sdf':
           fileToSend = sdf;
           break
         case 'spectrum':
           fileToSend = spectrum;
           break
         case 'dept135':
           fileToSend = dept135;
           break;
         case 'dept90':
            fileToSend = dept90;
           break
       }
       
       const requestOptions = {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({'fileType' : filetype, 'file' : fileToSend})
     };
 
     fetch("http://localhost:9000/checkFile",requestOptions).then((response) => {
       response.json().then((json) => {
         console.log(json)
         showAlert("Check "+filetype,json['checkResult'])
       }).catch((err) => {
           console.log(err);
         })
     }).catch((err) => {
       console.log(err);
     })
 
   }


  /*********************/
  /*     FUNCTIONS     */
  /*********************/

  /***
   * 
   * Function to check if sdf and 13c files are set before calling the Spring server
   * 
   ***/ 

  function check()
  {

    if (!c13IsSet)
    {
      showAlert("Error",'Please, upload a spectrum file.')
    }

    if (!sdfIsSet)
    {
      showAlert("Error",'Please, upload a SDF file.')
    }

    if (sdfIsSet && c13IsSet && !sdfIsLoading && !spectrumIsLoading && !dept135IsLoading && ! dept90IsLoading)
    {
      alertify.confirm("Confirm","Are you sure to continue ? Unsaved data will be lost.",
      
      function(){
        setLoading(true)
      },
      function(){  // if user clicks cancel
      });
      
    }
  }

  /***
   * 
   * Function to display message box
   * 
   ***/ 

  function showAlert(alerttitle,alertMessage)
  {
    alertify.alert(alerttitle, alertMessage);
  }

  function updateRanking(mol)
  {
    let newData = {...data};

    // Find the molecule and change it
    for (let i = 0; i < newData.ranking.length ; ++i)
    {
      if(newData.ranking[i].id===mol.id)
      {
        newData.ranking[i] = mol;
        break;
      }
    }
    // Sort the ranking by score then error
    newData.ranking.sort((mol1, mol2) => {
        if((mol1.matched_sdf_atoms_idx.length / mol1.all_shifts_sdf).toPrecision(3) === (mol2.matched_sdf_atoms_idx.length / mol2.all_shifts_sdf).toPrecision(3))
        {
          return mol1.error - mol2.error
        }
        else
        {
          return (mol2.matched_sdf_atoms_idx.length / mol2.all_shifts_sdf).toPrecision(3) - (mol1.matched_sdf_atoms_idx.length / mol1.all_shifts_sdf).toPrecision(3)
        }
      });

    // Update ranking with the array Index + 1 
    for (let i = 0 ; i < newData.ranking.length; ++i)
    {
        newData.ranking[i].rank = i+1;
    }

    setData(newData)
    setMolecule_nbr(-1)
  }
   

  function switchSdfMode()
  {
    setSDF(undefined)
    sdfIsSetPointer(false)
    setDEPT135(undefined)
    setDEPT90(undefined)
    setUseSdfList(!useSdfList)
  }

  function switchRmnMode()
  {
    setSpectrum(undefined)
    c13IsSetPointer(false)
    setDEPT135(undefined)
    setDEPT90(undefined)
    setUseRmnList(!useRmnList)
  }

  return(
    
    <>
      {/* If the user didn't choose any molecule, display input files to load SDF / Spectrum / DEPT 90 / DEPT 135 files + parameters */}

      {molecule_nbr === -1
        ? 
        <>
          {!loading
              ? <>
                  <div className='rmn-fileLoaderList'>
                    <button className={useSdfList ? 'rmn-activeSdfButton': 'rmn-sdfButton'} onClick={() => {switchSdfMode()}}>Use SDF file in the database</button>
                    <button className={useRmnList ? 'rmn-activeSdfButton': 'rmn-sdfButton'} onClick={() => {switchRmnMode()}}>Use RMN file in the database</button>
                    <FileLoaderList
                      sdfList={sdfList}
                      useSdfList={useSdfList}
                      setSDF={setSDF}
                      setSdfIsLoading={setSdfIsLoading}
                      setSpectrum={setSpectrum}
                      setSpectrumIsLoading={setSpectrumIsLoading}
                      setDEPT135={setDEPT135}
                      setDept135IsLoading={setDept135IsLoading}
                      setDEPT90={setDEPT90}
                      setDept90IsLoading={setDept90IsLoading}
                      sdfIsSetPointer={sdfIsSetPointer}
                      sdfIsSet={sdfIsSet}
                      c13IsSetPointer={c13IsSetPointer}
                      c13IsSet={c13IsSet}
                      dept135IsSet ={dept135IsSet}
                      dept135IsSetPointer = {dept135IsSetPointer}
                      sendcheckRequest ={sendcheckRequest}
                      setTitle = {setTitle}
                      titles = {titles}
                      useRmnList={useRmnList}
                      rmnList={rmnList}
                      hasFile={sdf !== undefined || spectrum !== undefined || dept135 !== undefined || dept90 !== undefined}
                    />
                  </div>
          
                  <Parameters params = {params} setParams={setParams}/>
                 </>
              : <></>}

            {/* Run button which became a loader if files are loaded or a request is sent to Spring server */}

            {loading
              ? <Loading/>
              : <div>
                  <button className='rmn-runButton' onClick={() => {check()}}>
                  {sdfIsLoading && spectrumIsLoading || dept135IsLoading || dept90IsLoading
                    ? <ClipLoader color={"#297085"}/>
                    : "Run"}
                  </button>
                </div>
            }
        </>
        : <></>
      }

      {/* If the user chose a molecule, display the interface to modify it */}

      {molecule_nbr !== -1
        ? <Molecule molecule={data.ranking[molecule_nbr]} setMolecule_nbr={setMolecule_nbr} updateRanking={updateRanking}/>
        : <></>
      }

      {/* If the user didn't choose a molecule and sent a request to Spring server, display the ranking of all the molecules */}

      {!loading && data && molecule_nbr === -1
        ?
        <>
          <div>
            <button className='rmn-runButton' onClick={() => {Save(data,deleteData,titles)}}>Save</button>
          </div>
          <MoleculesList data={data} setData={setData} chooseMolecule={setMolecule_nbr} deleteData={deleteData} setDeleteData={setDeleteData} />
        </>
        : <></>
      }
        
    </>
  )
}

export default RmnMotor;
