import MoleculeStructure from "./moleculeStructure";
import { Buffer } from 'buffer';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import "../styles/molecule.scss";
import { AtomList } from "./atomList";
import { useState } from "react";


export function Molecule({molecule,setMolecule_nbr,updateRanking})
{
  /*****************/
  /*     STATE     */
  /*****************/

  const [specificMolecule,setSpecificMolecule] = useState({...molecule})
  const [min,setMin] = useState(0)
  const [max,setMax] = useState(200)
  const [step,setStep] = useState(5)
  const [thickness,setThickness] = useState(5)

  ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      BarElement,
      Title,
      Tooltip,
      Legend
  );

  const labels = specificMolecule.matched_quat_sdf.concat(
    specificMolecule.matched_ter_sdf.concat(
      specificMolecule.matched_sec_sdf.concat(
        specificMolecule.matched_prim_sdf.concat(
          specificMolecule.matched_ter_prim_sdf.concat(
            specificMolecule.matched_no_dept_sdf)))))

  const dataChart = {
    labels,
    datasets: getDataSet()
  };

  let  myUni8Arr = Buffer.from(specificMolecule.base64, 'base64')

  /*********************/
  /*     FUNCTIONS     */
  /*********************/

  /***
   * 
   * Function to add/remove an atom from the molecule
   * 
   ***/

  function setHighlight(atom,shift,isAdd,type)
  {

      // Add the atom, its shift and its intensity to matched arrays and remove them from not_matched arrays

      if(isAdd)
      {
          if(type === "quat")
          {
            let intensity = specificMolecule.not_matched_quaternary_intensities[specificMolecule.not_matched_quat_atoms_sdf.indexOf(atom)]

            let new_intensities = [...specificMolecule.not_matched_quaternary_intensities]

            new_intensities.splice(specificMolecule.not_matched_quat_atoms_sdf.indexOf(atom),1)

            let spectrum_shift = specificMolecule.not_matched_spectrum_quaternary_shifts[specificMolecule.not_matched_quat_atoms_sdf.indexOf(atom)]

            let new_spectrum_shifts = [...specificMolecule.not_matched_spectrum_quaternary_shifts]

            new_spectrum_shifts.splice(specificMolecule.not_matched_quat_atoms_sdf.indexOf(atom),1)

            // Compute the new error of the molecule

            // Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept

            // Create an Array which contains matched spectrum in canonical order
            let matched_spectrum_shifts_canonical=[]
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat([...specificMolecule.matched_spectrum_quaternary_shifts,spectrum_shift])
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_and_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_secondary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_no_dept_shifts_spectrum)

            // Create an Array which contains matched sdf shifts in canonical order
            let matched_sdf_shifts_canonical = []
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat([...specificMolecule.matched_quat_sdf,shift])
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_sec_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_no_dept_sdf)

            // Compute the new Error 
            let error = matched_spectrum_shifts_canonical.length !== 0 ? matched_spectrum_shifts_canonical.map((x, i) => Math.abs(x - matched_sdf_shifts_canonical[i])).reduce((a, b) => a + b) : 0;
            error = error.toPrecision(3);

            // Modification of the molecule's score

            let score = ((specificMolecule.matched_sdf_atoms_idx.length+1) / specificMolecule.all_shifts_sdf).toPrecision(3) + " (" + (specificMolecule.matched_sdf_atoms_idx.length+1) + "/" + specificMolecule.all_shifts_sdf + " carbons)"

            setSpecificMolecule({...specificMolecule,
                                  matched_sdf_atoms_idx:[...specificMolecule.matched_sdf_atoms_idx,atom],
                                  matched_quat_atoms_sdf:[...specificMolecule.matched_quat_atoms_sdf,atom],
                                  matched_quat_sdf:[...specificMolecule.matched_quat_sdf,shift],
                                  matched_quaternary_intensities:[...specificMolecule.matched_quaternary_intensities,intensity],
                                  matched_spectrum_quaternary_shifts:[...specificMolecule.matched_spectrum_quaternary_shifts,spectrum_shift],
                                  not_matched_quaternary_intensities:new_intensities,
                                  not_matched_spectrum_quaternary_shifts:new_spectrum_shifts,
                                  not_matched_quat_atoms_sdf:[...specificMolecule.not_matched_quat_atoms_sdf].filter((value) => {return value !== atom}),
                                  not_matched_quat_sdf:[...specificMolecule.not_matched_quat_sdf].filter((value) => {return value !== shift}),
                                  error:+error,
                                  score:score
                                })
          }

          if(type === "ter")
          {
            let intensity = specificMolecule.not_matched_tertiary_intensities[specificMolecule.not_matched_ter_atoms_sdf.indexOf(atom)]

            let new_intensities = [...specificMolecule.not_matched_tertiary_intensities]

            new_intensities.splice(specificMolecule.not_matched_ter_atoms_sdf.indexOf(atom),1)

            let spectrum_shift = specificMolecule.not_matched_spectrum_tertiary_shifts[specificMolecule.not_matched_ter_atoms_sdf.indexOf(atom)]

            let new_spectrum_shifts = [...specificMolecule.not_matched_spectrum_tertiary_shifts]

            new_spectrum_shifts.splice(specificMolecule.not_matched_ter_atoms_sdf.indexOf(atom),1)

            // Compute the new error of the molecule

            // Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept

            // Create an Array which contains matched spectrum in canonical order
            let matched_spectrum_shifts_canonical=[]
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_quaternary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_and_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat([...specificMolecule.matched_spectrum_tertiary_shifts,spectrum_shift])
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_secondary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_no_dept_shifts_spectrum)

            // Create an Array which contains matched sdf shifts in canonical order
            let matched_sdf_shifts_canonical = []
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_quat_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat([...specificMolecule.matched_ter_sdf,shift])
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_sec_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_no_dept_sdf)

            // Compute the new Error 
            let error = matched_spectrum_shifts_canonical.length !== 0 ? matched_spectrum_shifts_canonical.map((x, i) => Math.abs(x - matched_sdf_shifts_canonical[i])).reduce((a, b) => a + b) : 0;
            error = error.toPrecision(3);

            // Modification of the molecule's score

            let score = ((specificMolecule.matched_sdf_atoms_idx.length+1) / specificMolecule.all_shifts_sdf).toPrecision(3) + " (" + (specificMolecule.matched_sdf_atoms_idx.length+1) + "/" + specificMolecule.all_shifts_sdf + " carbons)"

            setSpecificMolecule({...specificMolecule,
                                  matched_sdf_atoms_idx:[...specificMolecule.matched_sdf_atoms_idx,atom],
                                  matched_ter_atoms_sdf:[...specificMolecule.matched_ter_atoms_sdf,atom],
                                  matched_ter_sdf:[...specificMolecule.matched_ter_sdf,shift],
                                  matched_tertiary_intensities:[...specificMolecule.matched_tertiary_intensities,intensity],
                                  matched_spectrum_tertiary_shifts:[...specificMolecule.matched_spectrum_tertiary_shifts,spectrum_shift],
                                  not_matched_tertiary_intensities:new_intensities,
                                  not_matched_spectrum_tertiary_shifts:new_spectrum_shifts,
                                  not_matched_ter_atoms_sdf:[...specificMolecule.not_matched_ter_atoms_sdf].filter((value) => {return value !== atom}),
                                  not_matched_ter_sdf:[...specificMolecule.not_matched_ter_sdf].filter((value) => {return value !== shift}),
                                  error:+error,
                                  score:score
                                })
          }

          if(type === "sec")
          {
            let intensity = specificMolecule.not_matched_secondary_intensities[specificMolecule.not_matched_sec_atoms_sdf.indexOf(atom)]

            let new_intensities = [...specificMolecule.not_matched_secondary_intensities]

            new_intensities.splice(specificMolecule.not_matched_sec_atoms_sdf.indexOf(atom),1)

            let spectrum_shift = specificMolecule.not_matched_spectrum_secondary_shifts[specificMolecule.not_matched_sec_atoms_sdf.indexOf(atom)]

            let new_spectrum_shifts = [...specificMolecule.not_matched_spectrum_secondary_shifts]

            new_spectrum_shifts.splice(specificMolecule.not_matched_sec_atoms_sdf.indexOf(atom),1)

            // Compute the new error of the molecule

            // Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept

            // Create an Array which contains matched spectrum in canonical order
            let matched_spectrum_shifts_canonical=[]
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_quaternary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_and_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat([...specificMolecule.matched_spectrum_secondary_shifts,spectrum_shift])
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_no_dept_shifts_spectrum)

            // Create an Array which contains matched sdf shifts in canonical order
            let matched_sdf_shifts_canonical = []
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_quat_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat([...specificMolecule.matched_sec_sdf,shift])
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_no_dept_sdf)

            // Compute the new Error 
            let error = matched_spectrum_shifts_canonical.length !== 0 ? matched_spectrum_shifts_canonical.map((x, i) => Math.abs(x - matched_sdf_shifts_canonical[i])).reduce((a, b) => a + b) : 0;
            error = error.toPrecision(3);

            // Modification of the molecule's score

            let score = ((specificMolecule.matched_sdf_atoms_idx.length+1) / specificMolecule.all_shifts_sdf).toPrecision(3) + " (" + (specificMolecule.matched_sdf_atoms_idx.length+1) + "/" + specificMolecule.all_shifts_sdf + " carbons)"

            setSpecificMolecule({...specificMolecule,
                                  matched_sdf_atoms_idx:[...specificMolecule.matched_sdf_atoms_idx,atom],
                                  matched_sec_atoms_sdf:[...specificMolecule.matched_sec_atoms_sdf,atom],
                                  matched_sec_sdf:[...specificMolecule.matched_sec_sdf,shift],
                                  matched_secondary_intensities:[...specificMolecule.matched_secondary_intensities,intensity],
                                  matched_spectrum_secondary_shifts:[...specificMolecule.matched_spectrum_secondary_shifts,spectrum_shift],
                                  not_matched_secondary_intensities:new_intensities,
                                  not_matched_spectrum_secondary_shifts:new_spectrum_shifts,
                                  not_matched_sec_atoms_sdf:[...specificMolecule.not_matched_sec_atoms_sdf].filter((value) => {return value !== atom}),
                                  not_matched_sec_sdf:[...specificMolecule.not_matched_sec_sdf].filter((value) => {return value !== shift}),
                                  error:+error,
                                  score:score
                                })
          }

          if(type === "prim")
          {
            let intensity = specificMolecule.not_matched_primary_intensities[specificMolecule.not_matched_prim_atoms_sdf.indexOf(atom)]

            let new_intensities = [...specificMolecule.not_matched_primary_intensities]

            new_intensities.splice(specificMolecule.not_matched_prim_atoms_sdf.indexOf(atom),1)

            let spectrum_shift = specificMolecule.not_matched_spectrum_primary_shifts[specificMolecule.not_matched_prim_atoms_sdf.indexOf(atom)]

            let new_spectrum_shifts = [...specificMolecule.not_matched_spectrum_primary_shifts]

            new_spectrum_shifts.splice(specificMolecule.not_matched_prim_atoms_sdf.indexOf(atom),1)

            // Compute the new error of the molecule

            // Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept

            // Create an Array which contains matched spectrum in canonical order
            let matched_spectrum_shifts_canonical=[]
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_quaternary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_and_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_secondary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat([...specificMolecule.matched_spectrum_primary_shifts,spectrum_shift])
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_no_dept_shifts_spectrum)

            // Create an Array which contains matched sdf shifts in canonical order
            let matched_sdf_shifts_canonical = []
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_quat_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_sec_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat([...specificMolecule.matched_prim_sdf,shift])
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_no_dept_sdf)

            // Compute the new Error 
            let error = matched_spectrum_shifts_canonical.length !== 0 ? matched_spectrum_shifts_canonical.map((x, i) => Math.abs(x - matched_sdf_shifts_canonical[i])).reduce((a, b) => a + b) : 0;
            error = error.toPrecision(3);

            // Modification of the molecule's score

            let score = ((specificMolecule.matched_sdf_atoms_idx.length+1) / specificMolecule.all_shifts_sdf).toPrecision(3) + " (" + (specificMolecule.matched_sdf_atoms_idx.length+1) + "/" + specificMolecule.all_shifts_sdf + " carbons)"

            setSpecificMolecule({...specificMolecule,
                                  matched_sdf_atoms_idx:[...specificMolecule.matched_sdf_atoms_idx,atom],
                                  matched_prim_atoms_sdf:[...specificMolecule.matched_prim_atoms_sdf,atom],
                                  matched_prim_sdf:[...specificMolecule.matched_prim_sdf,shift],
                                  matched_primary_intensities:[...specificMolecule.matched_primary_intensities,intensity],
                                  matched_spectrum_primary_shifts:[...specificMolecule.matched_spectrum_primary_shifts,spectrum_shift],
                                  not_matched_primary_intensities:new_intensities,
                                  not_matched_spectrum_primary_shifts:new_spectrum_shifts,
                                  not_matched_prim_atoms_sdf:[...specificMolecule.not_matched_prim_atoms_sdf].filter((value) => {return value !== atom}),
                                  not_matched_prim_sdf:[...specificMolecule.not_matched_prim_sdf].filter((value) => {return value !== shift}),
                                  error:+error,
                                  score:score
                                })
          }

          if(type === "ter_prim")
          {
            let intensity = specificMolecule.not_matched_tertiary_and_primary_intensities[specificMolecule.not_matched_ter_prim_atoms_sdf.indexOf(atom)]

            let new_intensities = [...specificMolecule.not_matched_tertiary_and_primary_intensities]

            new_intensities.splice(specificMolecule.not_matched_ter_prim_atoms_sdf.indexOf(atom),1)

            let spectrum_shift = specificMolecule.not_matched_spectrum_tertiary_and_primary_shifts[specificMolecule.not_matched_ter_prim_atoms_sdf.indexOf(atom)]

            let new_spectrum_shifts = [...specificMolecule.not_matched_spectrum_tertiary_and_primary_shifts]

            new_spectrum_shifts.splice(specificMolecule.not_matched_ter_prim_atoms_sdf.indexOf(atom),1)

            // Compute the new error of the molecule

            // Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept

            // Create an Array which contains matched spectrum in canonical order
            let matched_spectrum_shifts_canonical=[]
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_quaternary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat([...specificMolecule.matched_spectrum_tertiary_and_primary_shifts,spectrum_shift])
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_secondary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_no_dept_shifts_spectrum)

            // Create an Array which contains matched sdf shifts in canonical order
            let matched_sdf_shifts_canonical = []
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_quat_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat([...specificMolecule.matched_ter_prim_sdf,shift])
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_sec_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_no_dept_sdf)

            // Compute the new Error 
            let error = matched_spectrum_shifts_canonical.length !== 0 ? matched_spectrum_shifts_canonical.map((x, i) => Math.abs(x - matched_sdf_shifts_canonical[i])).reduce((a, b) => a + b) : 0;
            error = error.toPrecision(3);

            // Modification of the molecule's score

            let score = ((specificMolecule.matched_sdf_atoms_idx.length+1) / specificMolecule.all_shifts_sdf).toPrecision(3) + " (" + (specificMolecule.matched_sdf_atoms_idx.length+1) + "/" + specificMolecule.all_shifts_sdf + " carbons)"

            setSpecificMolecule({...specificMolecule,
                                  matched_sdf_atoms_idx:[...specificMolecule.matched_sdf_atoms_idx,atom],
                                  matched_ter_prim_atoms_sdf:[...specificMolecule.matched_ter_prim_atoms_sdf,atom],
                                  matched_ter_prim_sdf:[...specificMolecule.matched_ter_prim_sdf,shift],
                                  matched_tertiary_and_primary_intensities:[...specificMolecule.matched_tertiary_and_primary_intensities,intensity],
                                  matched_spectrum_tertiary_and_primary_shifts:[...specificMolecule.matched_spectrum_tertiary_and_primary_shifts,spectrum_shift],
                                  not_matched_tertiary_and_primary_intensities:new_intensities,
                                  not_matched_spectrum_tertiary_and_primary_shifts:new_spectrum_shifts,
                                  not_matched_ter_prim_atoms_sdf:[...specificMolecule.not_matched_ter_prim_atoms_sdf].filter((value) => {return value !== atom}),
                                  not_matched_ter_prim_sdf:[...specificMolecule.not_matched_ter_prim_sdf].filter((value) => {return value !== shift}),
                                  error:+error,
                                  score:score
                                })
          }

          if(type === "no_dept")
          {
            let intensity = specificMolecule.not_matched_no_dept_intensities[specificMolecule.not_matched_no_dept_atoms_sdf.indexOf(atom)]

            let new_intensities = [...specificMolecule.not_matched_no_dept_intensities]

            new_intensities.splice(specificMolecule.not_matched_no_dept_atoms_sdf.indexOf(atom),1)

            let spectrum_shift = specificMolecule.not_matched_no_dept_shifts_spectrum[specificMolecule.not_matched_no_dept_atoms_sdf.indexOf(atom)]

            let new_spectrum_shifts = [...specificMolecule.not_matched_no_dept_shifts_spectrum]

            new_spectrum_shifts.splice(specificMolecule.not_matched_no_dept_atoms_sdf.indexOf(atom),1)

            // Compute the new error of the molecule

            // Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept

            // Create an Array which contains matched spectrum in canonical order
            let matched_spectrum_shifts_canonical=[]
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_quaternary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_and_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_secondary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat([...specificMolecule.matched_no_dept_shifts_spectrum,spectrum_shift])

            // Create an Array which contains matched sdf shifts in canonical order
            let matched_sdf_shifts_canonical = []
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_quat_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_sec_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat([...specificMolecule.matched_no_dept_sdf,shift])

            // Compute the new Error 
            let error = matched_spectrum_shifts_canonical.length !== 0 ? matched_spectrum_shifts_canonical.map((x, i) => Math.abs(x - matched_sdf_shifts_canonical[i])).reduce((a, b) => a + b) : 0;
            error = error.toPrecision(3);

            // Modification of the molecule's score

            let score = ((specificMolecule.matched_sdf_atoms_idx.length+1) / specificMolecule.all_shifts_sdf).toPrecision(3) + " (" + (specificMolecule.matched_sdf_atoms_idx.length+1) + "/" + specificMolecule.all_shifts_sdf + " carbons)"

            setSpecificMolecule({...specificMolecule,
                                  matched_sdf_atoms_idx:[...specificMolecule.matched_sdf_atoms_idx,atom],
                                  matched_no_dept_atoms_sdf:[...specificMolecule.matched_no_dept_atoms_sdf,atom],
                                  matched_no_dept_sdf:[...specificMolecule.matched_no_dept_sdf,shift],
                                  matched_no_dept_intensities:[...specificMolecule.matched_no_dept_intensities,intensity],
                                  matched_no_dept_shifts_spectrum:[...specificMolecule.matched_no_dept_shifts_spectrum,spectrum_shift],
                                  not_matched_no_dept_intensities:new_intensities,
                                  not_matched_no_dept_shifts_spectrum:new_spectrum_shifts,
                                  not_matched_no_dept_atoms_sdf:[...specificMolecule.not_matched_no_dept_atoms_sdf].filter((value) => {return value !== atom}),
                                  not_matched_no_dept_sdf:[...specificMolecule.not_matched_no_dept_sdf].filter((value) => {return value !== shift}),
                                  error:+error,
                                  score:score
                                })
          }
      }

      // Remove the atom, its shift and its intensity to matched arrays and add them to not_matched arrays

      else
      {
          if(type === "quat")
          {
            let intensity = specificMolecule.matched_quaternary_intensities[specificMolecule.matched_quat_atoms_sdf.indexOf(atom)]

            let new_intensities = [...specificMolecule.matched_quaternary_intensities]

            new_intensities.splice(specificMolecule.matched_quat_atoms_sdf.indexOf(atom),1)

            let spectrum_shift = specificMolecule.matched_spectrum_quaternary_shifts[specificMolecule.matched_quat_atoms_sdf.indexOf(atom)]

            let new_spectrum_shifts = [...specificMolecule.matched_spectrum_quaternary_shifts]

            new_spectrum_shifts.splice(specificMolecule.matched_quat_atoms_sdf.indexOf(atom),1)

            // Compute the new error of the molecule

            // Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept

            // Create an Array which contains matched spectrum in canonical order
            let matched_spectrum_shifts_canonical=[]
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(new_spectrum_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_and_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_secondary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_no_dept_shifts_spectrum)

            // Create an Array which contains matched sdf shifts in canonical order
            let matched_sdf_shifts_canonical = []
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat([...specificMolecule.matched_quat_sdf].filter((value) => {return value !== shift}))
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_sec_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_no_dept_sdf)

            // Compute the new Error 
            let error = matched_spectrum_shifts_canonical.length !== 0 ? matched_spectrum_shifts_canonical.map((x, i) => Math.abs(x - matched_sdf_shifts_canonical[i])).reduce((a, b) => a + b) : 0;
            error = error.toPrecision(3);

            // Modification of the molecule's score

            let score = ((specificMolecule.matched_sdf_atoms_idx.length-1) / specificMolecule.all_shifts_sdf).toPrecision(3) + " (" + (specificMolecule.matched_sdf_atoms_idx.length-1) + "/" + specificMolecule.all_shifts_sdf + " carbons)"

            setSpecificMolecule({...specificMolecule,
                                matched_sdf_atoms_idx:[...specificMolecule.matched_sdf_atoms_idx].filter((value) => {return value !== atom}),
                                matched_quat_atoms_sdf:[...specificMolecule.matched_quat_atoms_sdf].filter((value) => {return value !== atom}),
                                matched_quat_sdf:[...specificMolecule.matched_quat_sdf].filter((value) => {return value !== shift}),
                                matched_quaternary_intensities:new_intensities,
                                matched_spectrum_quaternary_shifts:new_spectrum_shifts,
                                not_matched_quaternary_intensities:[...specificMolecule.not_matched_quaternary_intensities,intensity],
                                not_matched_spectrum_quaternary_shifts:[...specificMolecule.not_matched_spectrum_quaternary_shifts,spectrum_shift],
                                not_matched_quat_atoms_sdf:[...specificMolecule.not_matched_quat_atoms_sdf,atom],
                                not_matched_quat_sdf:[...specificMolecule.not_matched_quat_sdf,shift],
                                error:+error,
                                score:score
                              })
          }

          if(type === "ter")
          {
            let intensity = specificMolecule.matched_tertiary_intensities[specificMolecule.matched_ter_atoms_sdf.indexOf(atom)]

            let new_intensities = [...specificMolecule.matched_tertiary_intensities]

            new_intensities.splice(specificMolecule.matched_ter_atoms_sdf.indexOf(atom),1)

            let spectrum_shift = specificMolecule.matched_spectrum_tertiary_shifts[specificMolecule.matched_ter_atoms_sdf.indexOf(atom)]

            let new_spectrum_shifts = [...specificMolecule.matched_spectrum_tertiary_shifts]

            new_spectrum_shifts.splice(specificMolecule.matched_ter_atoms_sdf.indexOf(atom),1)

            // Compute the new error of the molecule

            // Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept

            // Create an Array which contains matched spectrum in canonical order
            let matched_spectrum_shifts_canonical=[]
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_quaternary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_and_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(new_spectrum_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_secondary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_no_dept_shifts_spectrum)

            // Create an Array which contains matched sdf shifts in canonical order
            let matched_sdf_shifts_canonical = []
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_quat_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat([...specificMolecule.matched_ter_sdf].filter((value) => {return value !== shift}))
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_sec_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_no_dept_sdf)

            // Compute the new Error 
            let error = matched_spectrum_shifts_canonical.length !== 0 ? matched_spectrum_shifts_canonical.map((x, i) => Math.abs(x - matched_sdf_shifts_canonical[i])).reduce((a, b) => a + b) : 0;
            error = error.toPrecision(3);

            // Modification of the molecule's score

            let score = ((specificMolecule.matched_sdf_atoms_idx.length-1) / specificMolecule.all_shifts_sdf).toPrecision(3) + " (" + (specificMolecule.matched_sdf_atoms_idx.length-1) + "/" + specificMolecule.all_shifts_sdf + " carbons)"

            setSpecificMolecule({...specificMolecule,
                                matched_sdf_atoms_idx:[...specificMolecule.matched_sdf_atoms_idx].filter((value) => {return value !== atom}),
                                matched_ter_atoms_sdf:[...specificMolecule.matched_ter_atoms_sdf].filter((value) => {return value !== atom}),
                                matched_ter_sdf:[...specificMolecule.matched_ter_sdf].filter((value) => {return value !== shift}),
                                matched_tertiary_intensities:new_intensities,
                                matched_spectrum_tertiary_shifts:new_spectrum_shifts,
                                not_matched_tertiary_intensities:[...specificMolecule.not_matched_tertiary_intensities,intensity],
                                not_matched_spectrum_tertiary_shifts:[...specificMolecule.not_matched_spectrum_tertiary_shifts,spectrum_shift],
                                not_matched_ter_atoms_sdf:[...specificMolecule.not_matched_ter_atoms_sdf,atom],
                                not_matched_ter_sdf:[...specificMolecule.not_matched_ter_sdf,shift],
                                error:+error,
                                score:score
                              })
          }

          if(type === "sec")
          {
            let intensity = specificMolecule.matched_secondary_intensities[specificMolecule.matched_sec_atoms_sdf.indexOf(atom)]

            let new_intensities = [...specificMolecule.matched_secondary_intensities]

            new_intensities.splice(specificMolecule.matched_sec_atoms_sdf.indexOf(atom),1)

            let spectrum_shift = specificMolecule.matched_spectrum_secondary_shifts[specificMolecule.matched_sec_atoms_sdf.indexOf(atom)]

            let new_spectrum_shifts = [...specificMolecule.matched_spectrum_secondary_shifts]

            new_spectrum_shifts.splice(specificMolecule.matched_sec_atoms_sdf.indexOf(atom),1)

            // Compute the new error of the molecule

            // Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept

            // Create an Array which contains matched spectrum in canonical order
            let matched_spectrum_shifts_canonical=[]
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_quaternary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_and_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(new_spectrum_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_no_dept_shifts_spectrum)

            // Create an Array which contains matched sdf shifts in canonical order
            let matched_sdf_shifts_canonical = []
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_quat_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat([...specificMolecule.matched_sec_sdf].filter((value) => {return value !== shift}))
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_no_dept_sdf)

            // Compute the new Error 
            let error = matched_spectrum_shifts_canonical.length !== 0 ? matched_spectrum_shifts_canonical.map((x, i) => Math.abs(x - matched_sdf_shifts_canonical[i])).reduce((a, b) => a + b) : 0;
            error = error.toPrecision(3);

            // Modification of the molecule's score

            let score = ((specificMolecule.matched_sdf_atoms_idx.length-1) / specificMolecule.all_shifts_sdf).toPrecision(3) + " (" + (specificMolecule.matched_sdf_atoms_idx.length-1) + "/" + specificMolecule.all_shifts_sdf + " carbons)"

            setSpecificMolecule({...specificMolecule,
                                matched_sdf_atoms_idx:[...specificMolecule.matched_sdf_atoms_idx].filter((value) => {return value !== atom}),
                                matched_sec_atoms_sdf:[...specificMolecule.matched_sec_atoms_sdf].filter((value) => {return value !== atom}),
                                matched_sec_sdf:[...specificMolecule.matched_sec_sdf].filter((value) => {return value !== shift}),
                                matched_secondary_intensities:new_intensities,
                                matched_spectrum_secondary_shifts:new_spectrum_shifts,
                                not_matched_secondary_intensities:[...specificMolecule.not_matched_secondary_intensities,intensity],
                                not_matched_spectrum_secondary_shifts:[...specificMolecule.not_matched_spectrum_secondary_shifts,spectrum_shift],
                                not_matched_sec_atoms_sdf:[...specificMolecule.not_matched_sec_atoms_sdf,atom],
                                not_matched_sec_sdf:[...specificMolecule.not_matched_sec_sdf,shift],
                                error:+error,
                                score:score
                              })
          }

          if(type === "prim")
          {
            let intensity = specificMolecule.matched_primary_intensities[specificMolecule.matched_prim_atoms_sdf.indexOf(atom)]

            let new_intensities = [...specificMolecule.matched_primary_intensities]

            new_intensities.splice(specificMolecule.matched_prim_atoms_sdf.indexOf(atom),1)

            let spectrum_shift = specificMolecule.matched_spectrum_primary_shifts[specificMolecule.matched_prim_atoms_sdf.indexOf(atom)]

            let new_spectrum_shifts = [...specificMolecule.matched_spectrum_primary_shifts]

            new_spectrum_shifts.splice(specificMolecule.matched_prim_atoms_sdf.indexOf(atom),1)

            // Compute the new error of the molecule

            // Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept

            // Create an Array which contains matched spectrum in canonical order
            let matched_spectrum_shifts_canonical=[]
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_quaternary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_and_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_secondary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(new_spectrum_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_no_dept_shifts_spectrum)

            // Create an Array which contains matched sdf shifts in canonical order
            let matched_sdf_shifts_canonical = []
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_quat_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_sec_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat([...specificMolecule.matched_prim_sdf].filter((value) => {return value !== shift}))
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_no_dept_sdf)

            // Compute the new Error 
            let error = matched_spectrum_shifts_canonical.length !== 0 ? matched_spectrum_shifts_canonical.map((x, i) => Math.abs(x - matched_sdf_shifts_canonical[i])).reduce((a, b) => a + b) : 0;
            error = error.toPrecision(3);

            // Modification of the molecule's score

            let score = ((specificMolecule.matched_sdf_atoms_idx.length-1) / specificMolecule.all_shifts_sdf).toPrecision(3) + " (" + (specificMolecule.matched_sdf_atoms_idx.length-1) + "/" + specificMolecule.all_shifts_sdf + " carbons)"

            setSpecificMolecule({...specificMolecule,
                                matched_sdf_atoms_idx:[...specificMolecule.matched_sdf_atoms_idx].filter((value) => {return value !== atom}),
                                matched_prim_atoms_sdf:[...specificMolecule.matched_prim_atoms_sdf].filter((value) => {return value !== atom}),
                                matched_prim_sdf:[...specificMolecule.matched_prim_sdf].filter((value) => {return value !== shift}),
                                matched_primary_intensities:new_intensities,
                                matched_spectrum_primary_shifts:new_spectrum_shifts,
                                not_matched_primary_intensities:[...specificMolecule.not_matched_primary_intensities,intensity],
                                not_matched_spectrum_primary_shifts:[...specificMolecule.not_matched_spectrum_primary_shifts,spectrum_shift],
                                not_matched_prim_atoms_sdf:[...specificMolecule.not_matched_prim_atoms_sdf,atom],
                                not_matched_prim_sdf:[...specificMolecule.not_matched_prim_sdf,shift],
                                error:+error,
                                score:score
                              })
          }

          if(type === "ter_prim")
          {
            let intensity = specificMolecule.matched_tertiary_and_primary_intensities[specificMolecule.matched_ter_prim_atoms_sdf.indexOf(atom)]

            let new_intensities = [...specificMolecule.matched_tertiary_and_primary_intensities]

            new_intensities.splice(specificMolecule.matched_ter_prim_atoms_sdf.indexOf(atom),1)

            let spectrum_shift = specificMolecule.matched_spectrum_tertiary_and_primary_shifts[specificMolecule.matched_ter_prim_atoms_sdf.indexOf(atom)]

            let new_spectrum_shifts = [...specificMolecule.matched_spectrum_tertiary_and_primary_shifts]

            new_spectrum_shifts.splice(specificMolecule.matched_ter_prim_atoms_sdf.indexOf(atom),1)

            // Compute the new error of the molecule

            // Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept

            // Create an Array which contains matched spectrum in canonical order
            let matched_spectrum_shifts_canonical=[]
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_quaternary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(new_spectrum_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_secondary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_no_dept_shifts_spectrum)

            // Create an Array which contains matched sdf shifts in canonical order
            let matched_sdf_shifts_canonical = []
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_quat_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat([...specificMolecule.matched_ter_prim_sdf].filter((value) => {return value !== shift}))
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_sec_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_no_dept_sdf)

            // Compute the new Error 
            let error = matched_spectrum_shifts_canonical.length !== 0 ? matched_spectrum_shifts_canonical.map((x, i) => Math.abs(x - matched_sdf_shifts_canonical[i])).reduce((a, b) => a + b) : 0;
            error = error.toPrecision(3);

            // Modification of the molecule's score

            let score = ((specificMolecule.matched_sdf_atoms_idx.length-1) / specificMolecule.all_shifts_sdf).toPrecision(3) + " (" + (specificMolecule.matched_sdf_atoms_idx.length-1) + "/" + specificMolecule.all_shifts_sdf + " carbons)"
            
            setSpecificMolecule({...specificMolecule,
                                matched_sdf_atoms_idx:[...specificMolecule.matched_sdf_atoms_idx].filter((value) => {return value !== atom}),
                                matched_ter_prim_atoms_sdf:[...specificMolecule.matched_ter_prim_atoms_sdf].filter((value) => {return value !== atom}),
                                matched_ter_prim_sdf:[...specificMolecule.matched_ter_prim_sdf].filter((value) => {return value !== shift}),
                                matched_tertiary_and_primary_intensities:new_intensities,
                                matched_spectrum_tertiary_and_primary_shifts:new_spectrum_shifts,
                                not_matched_tertiary_and_primary_intensities:[...specificMolecule.not_matched_tertiary_and_primary_intensities,intensity],
                                not_matched_spectrum_tertiary_and_primary_shifts:[...specificMolecule.not_matched_spectrum_tertiary_and_primary_shifts,spectrum_shift],
                                not_matched_ter_prim_atoms_sdf:[...specificMolecule.not_matched_ter_prim_atoms_sdf,atom],
                                not_matched_ter_prim_sdf:[...specificMolecule.not_matched_ter_prim_sdf,shift],
                                error:+error,
                                score:score
                              })
          }

          if(type === "no_dept")
          {
            let intensity = specificMolecule.matched_no_dept_intensities[specificMolecule.matched_no_dept_atoms_sdf.indexOf(atom)]

            let new_intensities = [...specificMolecule.matched_no_dept_intensities]

            new_intensities.splice(specificMolecule.matched_no_dept_atoms_sdf.indexOf(atom),1)

            let spectrum_shift = specificMolecule.matched_no_dept_shifts_spectrum[specificMolecule.matched_no_dept_atoms_sdf.indexOf(atom)]

            let new_spectrum_shifts = [...specificMolecule.matched_no_dept_shifts_spectrum]

            new_spectrum_shifts.splice(specificMolecule.matched_no_dept_atoms_sdf.indexOf(atom),1)

            // Compute the new error of the molecule

            // Canonical order is : quaternaries, tertiaries and primaries, tertiaries, secondaries, primaries, no dept

            // Create an Array which contains matched spectrum in canonical order
            let matched_spectrum_shifts_canonical=[]
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_quaternary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_and_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_tertiary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_secondary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(specificMolecule.matched_spectrum_primary_shifts)
            matched_spectrum_shifts_canonical = matched_spectrum_shifts_canonical.concat(new_spectrum_shifts)

            // Create an Array which contains matched sdf shifts in canonical order
            let matched_sdf_shifts_canonical = []
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_quat_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_ter_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_sec_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat(specificMolecule.matched_prim_sdf)
            matched_sdf_shifts_canonical = matched_sdf_shifts_canonical.concat([...specificMolecule.matched_no_dept_sdf].filter((value) => {return value !== shift}))

            // Compute the new Error 
            let error = matched_spectrum_shifts_canonical.length !== 0 ? matched_spectrum_shifts_canonical.map((x, i) => Math.abs(x - matched_sdf_shifts_canonical[i])).reduce((a, b) => a + b) : 0;
            error = error.toPrecision(3);

            // Modification of the molecule's score

            let score = ((specificMolecule.matched_sdf_atoms_idx.length-1) / specificMolecule.all_shifts_sdf).toPrecision(3) + " (" + (specificMolecule.matched_sdf_atoms_idx.length-1) + "/" + specificMolecule.all_shifts_sdf + " carbons)"

            setSpecificMolecule({...specificMolecule,
                                matched_sdf_atoms_idx:[...specificMolecule.matched_sdf_atoms_idx].filter((value) => {return value !== atom}),
                                matched_no_dept_atoms_sdf:[...specificMolecule.matched_no_dept_atoms_sdf].filter((value) => {return value !== atom}),
                                matched_no_dept_sdf:[...specificMolecule.matched_no_dept_sdf].filter((value) => {return value !== shift}),
                                matched_no_dept_intensities:new_intensities,
                                matched_no_dept_shifts_spectrum:new_spectrum_shifts,
                                not_matched_no_dept_intensities:[...specificMolecule.not_matched_no_dept_intensities,intensity],
                                not_matched_no_dept_shifts_spectrum:[...specificMolecule.not_matched_no_dept_shifts_spectrum,spectrum_shift],
                                not_matched_no_dept_atoms_sdf:[...specificMolecule.not_matched_no_dept_atoms_sdf,atom],
                                not_matched_no_dept_sdf:[...specificMolecule.not_matched_no_dept_sdf,shift],
                                error:+error,
                                score:score
                              })
          }
      }
  }

  /***
   * 
   * Function to get the dataset for the chart
   * 
   ***/

  function getDataSet()
  {
      let dataset = []

      if(specificMolecule.matched_quat_sdf.length !== 0)
      {
          dataset.push(
            {
              label:'Quaternaries',
              type:'bar',
              data:getIntensities("quat"),
              backgroundColor: 'rgba(0, 0, 255, 0.5)',
              barPercentage: thickness,
            })
      }
      if(specificMolecule.matched_ter_sdf.length !== 0)
      {
          dataset.push(
            {
              label:'Tertiaries',
              type:'bar',
              data:getIntensities("ter"),
              backgroundColor: 'rgba(0, 255, 0, 0.5)',
              barPercentage: thickness
            })
      }
      if(specificMolecule.matched_sec_sdf.length !== 0)
      {
          dataset.push(
            {
              label:'Secondaries',
              type:'bar',
              data:getIntensities("sec"),
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
              barPercentage: thickness
            })
      }
      if(specificMolecule.matched_prim_sdf.length !== 0)
      {
          dataset.push(
            {
              label:'Primaries',
              type:'bar',
              data:getIntensities("prim"),
              backgroundColor: 'rgba(255, 205 , 130, 0.5)',
              barPercentage: thickness
            })
      }
      if(specificMolecule.matched_ter_prim_sdf.length !== 0)
      {
          dataset.push(
            {
              label:'Ternaries-Primaries',
              type:'bar',
              data:getIntensities("ter_prim"),
              backgroundColor: 'rgba(122, 0, 122, 0.5)',
              barPercentage: thickness
            })
      }
      if(specificMolecule.matched_no_dept_sdf.length !== 0)
      {
          dataset.push(
            {
              label:'All carbons',
              type:'bar',
              data:getIntensities("no_dept"),
              backgroundColor: 'rgba(122, 122, 0, 0.5)',
              barPercentage: thickness
            })
      }

      return dataset
  }

  /***
   * 
   * Function to get the intensities for each type of atom, and add 0 for other ones
   * 
   ***/

  function getIntensities(type)
  {
      let intensities = []

      if(type === "quat")
      {
          intensities = intensities.concat(specificMolecule.matched_quaternary_intensities)
            .concat(new Array(specificMolecule.matched_tertiary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_secondary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_primary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_tertiary_and_primary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_no_dept_intensities.length).fill(0))
      }

      if(type === "ter")
      {
        intensities = intensities.concat(new Array(specificMolecule.matched_quaternary_intensities.length).fill(0))
            .concat(specificMolecule.matched_tertiary_intensities)
            .concat(new Array(specificMolecule.matched_secondary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_primary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_tertiary_and_primary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_no_dept_intensities.length).fill(0))
      }

      if(type === "sec")
      {
        intensities = intensities.concat(new Array(specificMolecule.matched_quaternary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_tertiary_intensities.length).fill(0))
            .concat(specificMolecule.matched_secondary_intensities)
            .concat(new Array(specificMolecule.matched_primary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_tertiary_and_primary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_no_dept_intensities.length).fill(0))
      }

      if(type === "prim")
      {
        intensities = intensities.concat(new Array(specificMolecule.matched_quaternary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_tertiary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_secondary_intensities.length).fill(0))
            .concat(specificMolecule.matched_primary_intensities)
            .concat(new Array(specificMolecule.matched_tertiary_and_primary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_no_dept_intensities.length).fill(0))
      }

      if(type === "ter_prim")
      {
        intensities = intensities.concat(new Array(specificMolecule.matched_quaternary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_tertiary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_secondary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_primary_intensities.length).fill(0))
            .concat(specificMolecule.matched_tertiary_and_primary_intensities)
            .concat(new Array(specificMolecule.matched_no_dept_intensities.length).fill(0))
      }

      if(type === "no_dept")
      {
        intensities = intensities.concat(new Array(specificMolecule.matched_quaternary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_tertiary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_secondary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_primary_intensities.length).fill(0))
            .concat(new Array(specificMolecule.matched_tertiary_and_primary_intensities.length).fill(0))
            .concat(specificMolecule.matched_no_dept_intensities)
      }

      return intensities
  }


  function onSave()
  {
    updateRanking(specificMolecule);    // Call updateRanking function (in app.js)
  }

  return(
      <>
          <div className="molecule-details">
            <h1> {specificMolecule.name}</h1>
            <div>Rank : {specificMolecule.rank}</div>
            <div>MW : {specificMolecule.mw}</div>
            <div>Score match :{specificMolecule.score}</div>
            <div> Error: {specificMolecule.error} </div>
          </div>
        <div className="molecule-container">
          <div className="molecule-atoms">
            <AtomList
              setHighlight={setHighlight}
              quat_atoms={specificMolecule.matched_quat_atoms_sdf}
              quat_shifts={specificMolecule.matched_quat_sdf}
              quat_atoms_unmatched={specificMolecule.not_matched_quat_atoms_sdf}
              quat_shifts_unmatched={specificMolecule.not_matched_quat_sdf}
              ter_atoms={specificMolecule.matched_ter_atoms_sdf}
              ter_shifts={specificMolecule.matched_ter_sdf}
              ter_atoms_unmatched={specificMolecule.not_matched_ter_atoms_sdf}
              ter_shifts_unmatched={specificMolecule.not_matched_ter_sdf}
              sec_atoms={specificMolecule.matched_sec_atoms_sdf}
              sec_shifts={specificMolecule.matched_sec_sdf}
              sec_atoms_unmatched={specificMolecule.not_matched_sec_atoms_sdf}
              sec_shifts_unmatched={specificMolecule.not_matched_sec_sdf}
              prim_atoms={specificMolecule.matched_prim_atoms_sdf}
              prim_shifts={specificMolecule.matched_prim_sdf}
              prim_atoms_unmatched={specificMolecule.not_matched_prim_atoms_sdf}
              prim_shifts_unmatched={specificMolecule.not_matched_prim_sdf}
              ter_prim_atoms={specificMolecule.matched_ter_prim_atoms_sdf}
              ter_prim_shifts={specificMolecule.matched_ter_prim_sdf}
              ter_prim_atoms_unmatched={specificMolecule.not_matched_ter_prim_atoms_sdf}
              ter_prim_shifts_unmatched={specificMolecule.not_matched_ter_prim_sdf}
              no_dept_atoms={specificMolecule.matched_no_dept_atoms_sdf}
              no_dept_shifts={specificMolecule.matched_no_dept_sdf}
              no_dept_atoms_unmatched={specificMolecule.not_matched_no_dept_atoms_sdf}
              no_dept_shifts_unmatched={specificMolecule.not_matched_no_dept_sdf}
              />
          </div>
          <div className="molecule-graph">
            <MoleculeStructure
                  id={specificMolecule.name}
                  structure={specificMolecule.smile}
                  Uint8Array = {myUni8Arr}
                  extraDetails={{'atoms':specificMolecule.matched_sdf_atoms_idx,'addAtomIndices':true,'atomLabels':true,'highlightRadius' : 0.3}}
                  width={350}
                  height={300}
            />
    
            <div className="molecule-chart">
              <Chart
                data={dataChart}
                options={
                          {
                            scales:{
                                    x:{
                                        type:"linear",
                                        min:min,
                                        max:max,
                                        ticks:{stepSize:step},
                                        reverse:true
                                      },
                                    y:{
                                        ticks:{
                                          callback: function(value, index, ticks) {return value.toPrecision(5);}
                                              }
                                      }
                                  },
                            plugins:{
                              tooltip:{
                                    callbacks:{
                                                label: function(context) {
                                                    let label = context.dataset.label || '';
                
                                                    if (label)
                                                    {
                                                      label += ': ';
                                                    }

                                                    if (context.parsed.y !== null)
                                                    {
                                                      label += (context.parsed.y).toPrecision();
                                                    }

                                                    let atoms = specificMolecule.matched_quat_atoms_sdf.concat(
                                                                  specificMolecule.matched_ter_atoms_sdf.concat(
                                                                    specificMolecule.matched_sec_atoms_sdf.concat(
                                                                      specificMolecule.matched_prim_atoms_sdf.concat(
                                                                        specificMolecule.matched_ter_prim_atoms_sdf.concat(
                                                                          specificMolecule.matched_no_dept_atoms_sdf)))))

                                                    switch(context.dataset.label)
                                                    {
                                                      case "Quaternaries":
                                                        return [label,"Atom: "+atoms[context.dataIndex]];
                                                      case "Tertiaries":
                                                        return [label,"Atom: "+atoms[context.dataIndex]];
                                                      case "Secondaries":
                                                        return [label,"Atom: "+atoms[context.dataIndex]];
                                                      case "Primaries":
                                                        return [label,"Atom: "+atoms[context.dataIndex]];
                                                      case "Tertiaries-Primaries":
                                                        return [label,"Atom: "+atoms[context.dataIndex]];
                                                      case "All carbons":
                                                          return [label,"Atom: "+atoms[context.dataIndex]];
                                                      default:
                                                          return label;
                                                    }
                                                  }
                                              }
                                    }
                            }}
                        }
              />
            </div>
            <div className="molecule-chart-params">
              <label htmlFor="min">Min :</label>
              <input type="number" id="min" size="4" value={min} onChange={(e) => {setMin(+e.target.value);}}/>
              <label htmlFor="max">Max :</label>
              <input type="number" id="max" size="4" value={max} onChange={(e) => {setMax(+e.target.value)}}/>
              <label htmlFor="step">Step :</label>
              <input type="number" id="step" size="3" value={step} onChange={(e) => {setStep(+e.target.value)}}/>
              <label htmlFor="thick">Thickness :</label>
              <input type="number" id="thick" size="3"value={thickness} onChange={(e) => {setThickness(+e.target.value)}}/>
            </div>
          </div>
          <div className="molecule-buttons">
            <button className="" onClick={() => {onSave()}}>Save</button>
            <button className="" onClick={() => {setMolecule_nbr(-1)}}>Cancel</button>
          </div>
        </div>
      </>
  )
}