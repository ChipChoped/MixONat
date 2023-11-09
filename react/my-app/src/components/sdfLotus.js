
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

  const listItems = [];

  const handleFamilyClick = (family) => {
    setSelectedItem(family);
    setSelectedFamily(family);
    setSelectedGenus(undefined);
    setSelectedSpecies(undefined);
    setSelectedPathway(undefined);
    setSelectedSuperclass(undefined);
    setSelectedClass(undefined);
  };

  const handleGenusClick = (genus) => {
    setSelectedItem(genus);
    setSelectedGenus(genus);
    setSelectedSpecies(undefined);
    setSelectedPathway(undefined);
    setSelectedSuperclass(undefined);
    setSelectedClass(undefined);
  };

  const handleSpeciesClick = (species) => {
    setSelectedItem(species);
    setSelectedSpecies(species);
    setSelectedPathway(undefined);
    setSelectedSuperclass(undefined);
    setSelectedClass(undefined);
  };

  const handlePathwayClick = (pathway) => {
    setSelectedItem(pathway);
    setSelectedPathway(pathway);
    setSelectedSuperclass(undefined);
    setSelectedClass(undefined);
    setSelectedFamily(undefined);
    setSelectedGenus(undefined);
    setSelectedSpecies(undefined);
  };

  const handleSuperclassClick = (superclass) => {
    setSelectedItem(superclass);
    setSelectedSuperclass(superclass);
    setSelectedClass(undefined);
    setSelectedFamily(undefined);
    setSelectedGenus(undefined);
    setSelectedSpecies(undefined);
  };

  const handleClassClick = (class_) => {
    setSelectedItem(class_);
    setSelectedClass(class_);
    setSelectedFamily(undefined);
    setSelectedGenus(undefined);
    setSelectedSpecies(undefined);
  };
  
  const handleItemClick = (item) => {
    setSelectedItem(item);
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
      try {
        const response = await axios.get(`http://localhost:5000/getGenus/${selectedFamily}`);
        setTaxonomyGenusList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste genus :', error);
      }
    };
    fetchTaxonomyGenusList();
  }, [selectedFamily]);

  useEffect(() => {
    const fetchTaxonomySpeciesList = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getSpecies/${selectedGenus}`);
        setTaxonomySpeciesList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste species :', error);
      }
    };
    fetchTaxonomySpeciesList();
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
      try {
        const response = await axios.get(`http://localhost:5000/getSuperclass/${selectedPathway}`);
        setOntologySuperclassList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste superclass :', error);
      }
    };
    fetchOntologySuperclassList();
  }, [selectedPathway]);

  useEffect(() => {
    const fetchOntologyClassList = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getClass/${selectedSuperclass}`);
        setOntologyClassList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste class :', error);
      }
    };
    fetchOntologyClassList();
  }, [selectedSuperclass]);

  return (
    <div>
        <div class="allColumn">
            <div class="column">
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
                <button onClick={() => null}>Ajouter</button>
                <button onClick={() => null}>Supprimer</button>
            </div>
            <div class="column">
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
                <button onClick={() => null}>Ajouter</button>
                <button onClick={() => null}>Supprimer</button>
            </div>
            <div class="column">
              <div>
                <h2>Filtres</h2>
                  <div className="list-container">
                    <ul>
                      {listItems.map((item, index) => (
                        <li
                          key={index}
                          className={`list-item ${selectedItem === item ? 'selected' : ''}`}
                          onClick={() => handleItemClick(item)}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button>Create SDF</button>
              </div>            
            </div>
        </div>
    </div>

  );
}

export default SdfLotus;