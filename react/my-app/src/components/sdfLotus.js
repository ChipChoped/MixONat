
import 'alertifyjs/build/css/alertify.css';
import "../styles/rmn.scss";
import React, {useEffect, useState } from 'react';
import "../styles/sdfLotus.scss";
import axios from 'axios';

function SdfLotus() {


  const [taxonomyFamilyList, setTaxonomyFamilyList] = useState([]);
  const [taxonomyGenusList, setTaxonomyGenusList] = useState([]);
  const [taxonomySpeciesList, setTaxonomySpeciesList] = useState([]);

  const [selectedFamily, setSelectedFamily] = useState(undefined);
  const [selectedGenus, setSelectedGenus] = useState(undefined);
  const [selectedSpecies, setSelectedSpecies] = useState(undefined);

  const [ontologyPathwayList, setOntologyPathwayList] = useState([]);
  const [ontologySuperclassList, setOntologySuperclassList] = useState([]);
  const [ontologyClassList, setOntologyClassList] = useState([]);

  const [selectedPathway, setSelectedPathway] = useState(undefined);
  const [selectedSuperclass, setSelectedSuperclass] = useState(undefined);
  const [selectedClass, setSelectedClass] = useState(undefined);

  const [selectedItem, setSelectedItem] = useState(null);
  
  const [statusMessage, setStatusMessage] = useState('');

  const [filtreList, setFiltreList] = useState([]);
  const addElementToFiltreList = (newElement) => {
    if (!filtreList.includes(newElement)) {
      setFiltreList((prevList) => [...prevList, newElement]);
    }
  };

  const [fileName, setFileName] = useState("");

  const handleFamilyClick = (family) => {
    setSelectedGenus(undefined);
    setSelectedSpecies(undefined);
    setSelectedPathway(undefined);
    setSelectedSuperclass(undefined);
    setSelectedClass(undefined);
    setSelectedItem(family);
    setSelectedFamily(family);
  };

  const handleGenusClick = (genus) => {
    setSelectedSpecies(undefined);
    setSelectedPathway(undefined);
    setSelectedSuperclass(undefined);
    setSelectedClass(undefined);
    setSelectedItem(genus);
    setSelectedGenus(genus);
  };

  const handleSpeciesClick = (species) => {
    setSelectedPathway(undefined);
    setSelectedSuperclass(undefined);
    setSelectedClass(undefined);
    setSelectedItem(species);
    setSelectedSpecies(species);
  };

  const handlePathwayClick = (pathway) => {
    setSelectedFamily(undefined);
    setSelectedGenus(undefined);
    setSelectedSpecies(undefined);
    setSelectedSuperclass(undefined);
    setSelectedClass(undefined);
    setSelectedItem(pathway);
    setSelectedPathway(pathway);
  };

  const handleSuperclassClick = (superclass) => {
    setSelectedClass(undefined);
    setSelectedFamily(undefined);
    setSelectedGenus(undefined);
    setSelectedSpecies(undefined);
    setSelectedItem(superclass);
    setSelectedSuperclass(superclass);
  };

  const handleClassClick = (class_) => {
    setSelectedFamily(undefined);
    setSelectedGenus(undefined);
    setSelectedSpecies(undefined);
    setSelectedItem(class_);
    setSelectedClass(class_);
  };

  const handleClearOntologyClick = () => {
    setSelectedPathway(undefined);
    setSelectedSuperclass(undefined);
    setSelectedClass(undefined);
    setSelectedItem();
  };

  const handleClearTaxonomyClick = () => {
    setSelectedFamily(undefined);
    setSelectedGenus(undefined);
    setSelectedSpecies(undefined);
    setSelectedItem();
  };

  const handleFiltreClick = (filtre) => {
    setSelectedItem(filtre);
  };

  const handleDeleteAllFiltreClick = () => {
    setFiltreList([]);
  };

  const handleDeleteFiltreClick = () => {
    const updatedList = filtreList.filter((item) => item !== selectedItem);
    setFiltreList(updatedList);
  };

  const handleCreateSdfClick = async () => {
    try {
      setStatusMessage('is running...'); 
      const response = await axios.post('http://localhost:5000/createSdf', {
        array: filtreList,
        fileName: fileName,
      });  
      // Faites quelque chose avec la réponse ici, si nécessaire
      console.log(response);
      if(response.status === 200) {
          setStatusMessage('SDF created');
      }else{
          setStatusMessage('Erreur');
      }
    } catch (error) {
      console.error('Erreur lors de l appel de la route createSdf :', error);
      if (error.response) {
        setStatusMessage('Erreurlors de la creation du SDF');
      }
    }
  };

  useEffect(() => {
    // Fonction pour récupérer la liste depuis la route Flask
    const fetchTaxonomyFamilyList = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getFamily');  
        setTaxonomyFamilyList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste family:', error);
      }
    };
    fetchTaxonomyFamilyList();
  }, []);  // Le tableau vide [] en tant que deuxième argument signifie que cela s'exécutera une seule fois lors du montage du composant

  useEffect(() => {
    const fetchTaxonomyGenusList = async () => {
      // Vérifiez si selectedFamily est différent de undefined
      if (selectedFamily !== undefined) {
        try {
          const response = await axios.get(`http://localhost:5000/getGenus/${selectedFamily}`);
          setTaxonomyGenusList(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération de la liste genus :', error);
        }
      }else{
        setTaxonomyGenusList([]);
      }
    };

    fetchTaxonomyGenusList();
  }, [selectedFamily]);

  useEffect(() => {
    //if(selectedGenus!=undefined) {
      const fetchTaxonomySpeciesList = async () => {
        if (selectedGenus !== undefined) {
          try {
            const response = await axios.get(`http://localhost:5000/getSpecies/${selectedGenus}`);
            setTaxonomySpeciesList(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération de la liste species :', error);
          }
        }else{
          setTaxonomySpeciesList([]);
        }
      };
      fetchTaxonomySpeciesList();
    //}
  }, [selectedGenus]);


  ////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // Fonction pour récupérer la liste depuis la route Flask
    const fetchOntologyPathwayList = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getPathway');  
        setOntologyPathwayList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste pathway:', error);
      }
    };
    fetchOntologyPathwayList();
  }, []);  // Le tableau vide [] en tant que deuxième argument signifie que cela s'exécutera une seule fois lors du montage du composant

  useEffect(() => {
    const fetchOntologySuperclassList = async () => {
      //if(selectedPathway!=undefined) {
      if (selectedPathway !== undefined) {
        try {
          const response = await axios.get(`http://localhost:5000/getSuperclass/${selectedPathway}`);
          setOntologySuperclassList(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération de la liste superclass :', error);
        }
      }else{
        setOntologySuperclassList([]);
      }
    };
    fetchOntologySuperclassList();
    //}
  }, [selectedPathway]);

  useEffect(() => {
    const fetchOntologyClassList = async () => {
      //if(selectedSuperclass!=undefined) {
      if (selectedSuperclass !== undefined) {
        try {
          const response = await axios.get(`http://localhost:5000/getClass/${selectedSuperclass}`);
          setOntologyClassList(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération de la liste class :', error);
        }
      }else{
        setOntologyClassList([]);
      }
    };
    fetchOntologyClassList();
    //}
  }, [selectedSuperclass]);

  ////////////////////////////////////////////////////////////////////////////

  const handleAddTaxonomyClick = () => {
      const fetchTaxonomyFiltre = async () => {
        var taxonomyCriteria = undefined;
        var taxonomyType = undefined;
        if(selectedSpecies!==undefined){
          taxonomyCriteria=selectedSpecies;
          taxonomyType = "species";
        }else if(selectedGenus!==undefined){
          taxonomyCriteria=selectedGenus;
          taxonomyType = "genus";
        }else if(selectedFamily!==undefined){
          taxonomyCriteria=selectedFamily;
          taxonomyType = "family";
        }
        if(taxonomyCriteria!==undefined){
          try {
            const response = await axios.get(`http://localhost:5000/getTaxonomyFiltre/${taxonomyType}/${taxonomyCriteria}`);
            addElementToFiltreList(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération du filtre :', error);
          }
        }
      };
      fetchTaxonomyFiltre();
  };

  const handleAddOntologyClick = () => {
    const fetchOntologyFiltre = async () => {
      var ontologyCriteria = undefined;
      var ontologyType = undefined;
      if(selectedClass!==undefined){
        ontologyCriteria=selectedClass;
        ontologyType = "class";
      }else if(selectedSuperclass!==undefined){
        ontologyCriteria=selectedSuperclass;
        ontologyType = "superclass";
      }else if(selectedPathway!==undefined){
        ontologyCriteria=selectedPathway;
        ontologyType = "pathway";
      }
      if(ontologyCriteria!==undefined){
        try {
          const response = await axios.get(`http://localhost:5000/getOntologyFiltre/${ontologyType}/${ontologyCriteria}`);
          addElementToFiltreList(response.data);
          
        } catch (error) {
          console.error('Erreur lors de la récupération du filtre :', error);
        }
      }
    };
    fetchOntologyFiltre();
};

  return (
    <div>
        <div className="allColumn">
            <div className="column">
                {/* Colonne 1 */}
                <h2>Taxonomy</h2>
                <div>
                  <h3>Family</h3>
                  <div className="list-container">
                    <ul>
                      {taxonomyFamilyList.map((family, index) => (
                        <li 
                          key={index}
                          className={`list-item ${selectedItem === family ? 'selected' : ''}`}
                          onClick={() => handleFamilyClick(family)}>
                            {family} 
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h3>Genus</h3>
                  <div className="list-container">
                  <ul>
                      {taxonomyGenusList.map((genus, index) => (
                        <li 
                          key={index}
                          className={`list-item ${selectedItem === genus ? 'selected' : ''}`}
                          onClick={() => handleGenusClick(genus)}>
                            {genus} 
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h3>Species</h3>
                  <div className="list-container">
                    <ul>
                        {taxonomySpeciesList.map((species, index) => (
                          <li 
                            key={index}
                            className={`list-item ${selectedItem === species ? 'selected' : ''}`}
                            onClick={() => handleSpeciesClick(species)}>
                              {species} 
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>
                <button onClick={() => handleAddTaxonomyClick()}>Add</button>
                <button onClick={() => handleClearTaxonomyClick()}>Clear</button>
            </div>
            <div className="column">
                {/* Colonne 2 */}
                <h2>Ontology</h2>
                <div>
                  <h3>NP Pathways</h3>
                  <div className="list-container">
                    <ul>
                        {ontologyPathwayList.map((pathway, index) => (
                          <li 
                            key={index}
                            className={`list-item ${selectedItem === pathway ? 'selected' : ''}`}
                            onClick={() => handlePathwayClick(pathway)}>
                              {pathway} 
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>
                <div>
                  <h3>NP Superclass</h3>
                  <div className="list-container">
                    <ul>
                        {ontologySuperclassList.map((superclass, index) => (
                          <li 
                            key={index}
                            className={`list-item ${selectedItem === superclass ? 'selected' : ''}`}
                            onClick={() => handleSuperclassClick(superclass)}>
                              {superclass} 
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>
                <div>
                  <h3>NP Class</h3>
                  <div className="list-container">
                    <ul>
                        {ontologyClassList.map((class_, index) => (
                          <li 
                            key={index}
                            className={`list-item ${selectedItem === class_ ? 'selected' : ''}`}
                            onClick={() => handleClassClick(class_)}>
                              {class_} 
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>
                <button onClick={() => handleAddOntologyClick()}>Add</button>
                <button onClick={() => handleClearOntologyClick()}>Clear</button>
            </div>
            <div className="column">
              <div>
                <h2>Filtres</h2>
                  <div className="list-container">
                    <ul>
                        {filtreList.map((filtre, index) => (
                          <li 
                            key={index}
                            className={`list-item ${selectedItem === filtre ? 'selected' : ''}`}
                            onClick={() => handleFiltreClick(filtre)}>
                              {filtre} 
                          </li>
                        ))}
                      </ul>
                  </div>
                  <input
                    type="text"
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="sdf name"
                  />
                  <button onClick={() => handleCreateSdfClick()}>Create SDF</button>
                  <p>{statusMessage}</p>
                  <button onClick={() => handleDeleteFiltreClick()}>Delete</button>
                  <button onClick={() => handleDeleteAllFiltreClick()}>Delete all</button>
              </div>            
            </div>
        </div>
    </div>

  );
}

export default SdfLotus;