import { Buffer } from 'buffer';

/**
 * main méthod that creates result files and download them
 * @param {*} data have general informations of the result and the ranking of the moleculs
 * @param {*} deleteData array of the deleted moleculs
 */
export function Save(data,deleteData,titles){
    let str="";
    let datas={...data};
    let is135= datas.result.dept_135_file?true:false
    let is90= datas.result.dept_90_file? true:false
    //let name=document.getElementById("spectrum").files[0].name;
    let name=titles.spectrum;
    if(is135 && !is90){
        name+=" with dept135";
    }
    if( is135 && is90){
        name+=" with dept135 and dept90";
    }
    var now=new Date();
    var hour=now.getHours();
    var minutes=now.getMinutes();
    var seconds=now.getSeconds();
    name+=" "+hour+"h"+minutes+"m"+seconds+"s";
    str+=addFirstParagraph(datas.result,datas.ranking.length,titles);
    for( let i=0;i<datas.ranking.length;i++){
        let element=datas.ranking[i];
        str+=addSpace();
        str+="Rank : "+(i+1)+"\n";
        str+=addMolecule(element,is135,is90);
    }

    str+="\n\n\nUSER DELETED RESULTS\n\n\n";
    deleteData.forEach(element => {
        str+=addSpace(str);
        str+=addMolecule(element,is135,is90);
    });
    
    download(str,name);
    saveImg(datas.ranking,name);

}

/**
 * 
 * @returns string with -- to separate molecules
 */
function addSpace(){
     let str="\n";
    for(let i=0;i<200;i++){
        str+="_";
    }
    str+="\n";
    for(let i=0;i<200;i++){
        str+="_";
    }
    str+="\n\n";
    return str;
}

/**
 * 
 * @param {*} element a molecul
 * @param {*} is135 true if there is a dept135 file
 * @param {*} is90 true if there is a dept90 file
 * @returns string with molecul infos
 */
function addMolecule(element,is135,is90){
    let str="ID : "+element.id+"\n";
    str+="Name : "+element.name+"\n";
    str+="CAS : "+element.cas+"\n";
    str+="MW : "+element.mw+"\n";
    str+="Score : "+element.score+"\n";

    str+="Cumulated absolute difference : "+element.error+"\n";
    str+="Spectrum shifts left : "+element.spectrum_shifts_left+"\n";
    str+="\n";

    /*add shifts and these intensities with this form:
        -matched with spectrum shifts
        -matched database shifts
        -matched intensities
        if there are any not matched shift
            -not matched shifts
     */
    if(!is135 && !is90){//if we have just database and 
        str+="Matched Spectrum Shifts : \n"+arrayToStrShifts(element.matched_no_dept_shifts_spectrum)+"\n";
        str+="Matched SDF Shifts : \n"+arrayToStrShifts(element.matched_sdf_shifts)+"\n";
        str+="Matched Intensities : \n"+arrayToStrIntensities(element.matched_spectrum_intensities)+"\n";
        if(element.not_matched_sdf_shifts.length>0){
            str+="Not Matched SDF Shifts : \n"+arrayToStrShifts(element.not_matched_sdf_shifts)+"\n";
        }
    }else{
        if(!is90){//when just dept 135 
            //quaternary
            if(element.matched_spectrum_quaternary_shifts.length>0){
                str+="Matched spectrum quaternary shifts : \n"+arrayToStrShifts(element.matched_spectrum_quaternary_shifts)+"\n";
                str+="Matched SDF quaternary shifts : \n"+arrayToStrShifts(element.matched_quat_sdf)+"\n";
                str+="Matched quaternary intensities : \n"+arrayToStrIntensities(element.matched_quaternary_intensities)+"\n";
            }
            if(element.not_matched_quat_sdf.length>0){
                str+="Not matched SDF quaternary shifts : \n"+arrayToStrShifts(element.not_matched_quat_sdf)+"\n";
            }
            if(element.matched_spectrum_quaternary_shifts.length>0 || element.not_matched_quat_sdf.length>0){
                str+="\n";
            }

            //tertiary and primary concat
            if(element.matched_spectrum_tertiary_and_primary_shifts.length>0){
                str+="Matched spectrum tertiary and primary shifts : \n"+arrayToStrShifts(element.matched_spectrum_tertiary_and_primary_shifts)+"\n";
                str+="Matched SDF tertiary and primary shifts : \n"+arrayToStrShifts(element.matched_ter_prim_sdf)+"\n";
                str+="Matched tertiary and primary intensities : \n"+arrayToStrIntensities(element.matched_tertiary_and_primary_intensities)+"\n";
            }
            if(element.not_matched_ter_prim_sdf.length>0){
                str+="Not matched SDF tertiary and primary shifts : \n"+arrayToStrShifts(element.not_matched_ter_prim_sdf)+"\n";
            }
            if(element.matched_spectrum_tertiary_and_primary_shifts.length>0 || element.not_matched_ter_prim_sdf.length>0){
                str+="\n";
            }

            //secondary
            if(element.matched_spectrum_secondary_shifts.length>0){
                str+="Matched spectrum secondary shifts : \n"+arrayToStrShifts(element.matched_spectrum_secondary_shifts)+"\n";
                str+="Matched SDF secondary shifts : \n"+arrayToStrShifts(element.matched_sec_sdf)+"\n";
                str+="Matched secondary intensities : \n"+arrayToStrIntensities(element.matched_secondary_intensities)+"\n";
            }
            if(element.not_matched_sec_sdf.length>0){
                str+="Not matched SDF  secondary shifts : \n"+arrayToStrShifts(element.not_matched_sec_sdf)+"\n";
            }
        }else{//when dept 135 and dept 90  

            //quaternary
            if(element.matched_spectrum_quaternary_shifts.length>0){
                str+="Matched spectrum quaternary shifts : \n"+arrayToStrShifts(element.matched_spectrum_quaternary_shifts)+"\n";
                str+="Matched SDF quaternary shifts : \n"+arrayToStrShifts(element.matched_quat_sdf)+"\n";
                str+="Matched quaternary intensities : \n"+arrayToStrIntensities(element.matched_quaternary_intensities)+"\n";
            }
            if(element.not_matched_quat_sdf.length>0){
                str+="Not matched SDF quaternary shifts : \n"+arrayToStrShifts(element.not_matched_quat_sdf)+"\n";
            }
            if(element.matched_spectrum_quaternary_shifts.length>0 || element.not_matched_quat_sdf.length>0){
                str+="\n";
            }

            //tertiary
            if(element.matched_spectrum_tertiary_shifts.length>0){
                str+="Matched spectrum tertiary shifts : \n"+arrayToStrShifts(element.matched_spectrum_tertiary_shifts)+"\n";
                str+="Matched SDF tertiary shifts : \n"+arrayToStrShifts(element.matched_ter_sdf)+"\n";
                str+="Matched tertiary intensities : \n"+arrayToStrIntensities(element.matched_tertiary_intensities)+"\n";
            }
            if(element.not_matched_ter_sdf.length>0){
                str+="Not matched SDF tertiary shifts : \n"+arrayToStrShifts(element.not_matched_ter_sdf)+"\n";
            }
            if(element.matched_spectrum_tertiary_shifts.length>0 || element.not_matched_ter_sdf.length>0){
                str+="\n";
            }

            //secondary
            if(element.matched_spectrum_secondary_shifts.length>0){
                str+="Matched spectrum secondary shifts : \n"+arrayToStrShifts(element.matched_spectrum_secondary_shifts)+"\n";
                str+="Matched SDF secondary shifts : \n"+arrayToStrShifts(element.matched_sec_sdf)+"\n";
                str+="Matched secondary intensities : \n"+arrayToStrIntensities(element.matched_secondary_intensities)+"\n";
            }
            if(element.not_matched_sec_sdf.length>0){
                str+="Not matched SDF  secondary shifts : \n"+arrayToStrShifts(element.not_matched_sec_sdf)+"\n";
            }
            if(element.matched_spectrum_secondary_shifts.length>0 || element.not_matched_sec_sdf.length>0){
                str+="\n";
            }

            //primary
            if(element.matched_spectrum_primary_shifts.length>0){
                str+="Matched spectrum primary shifts : \n"+arrayToStrShifts(element.matched_spectrum_primary_shifts)+"\n";
                str+="Matched SDF primary shifts : \n"+arrayToStrShifts(element.matched_prim_sdf)+"\n";
                str+="Matched primary intensities : \n"+arrayToStrIntensities(element.matched_primary_intensities)+"\n";
            }
            if(element.not_matched_prim_sdf.length>0){
                str+="Not matched SDF primary shifts : \n"+arrayToStrShifts(element.not_matched_prim_sdf)+"\n";
            }

        }
    }
    return str;
}


/**
 * download result text file
 * create an element click on it then remove it without display on our window
 * @param {*} str  the string we want to write in the file
 * @param {*} name   the name of the spectrum file
 */
function download(str,name){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
    element.setAttribute('download', "SaveResult-"+name+".txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/**
 * 
 * @param {*} result general informations of the result
 * @param {*} rankingLength number of molecul result 
 * @returns string with general informations of the result
 */
function addFirstParagraph(result,rankingLength,titles){
    let str="";
    str+="RESULTS FILE\n\n";
    str+="MixONat\n\n";
    let sdfTitle=titles.sdf;
    str+="SDF : "+sdfTitle+"\n";
    let spectrumFile=titles.spectrum;
    str+="Spectrum file : "+spectrumFile+"\n";
    if(result.dept_135_file){
        let dept135=titles.dept135;
        str+="DEPT 135 file : "+dept135+"\n";
    }
    if(result.dept_90_file){
        let dept90=titles.dept90;
        str+="DEPT 90 file : "+dept90+"\n";
    }
    str+="\n";
    str+="Allowed margin : "+result.allowed_margin+"\n";
    if(result.alignment_accuracy_135){
        str+="Alignment accuracy 135 : "+result.alignment_accuracy_135+"\n";
    }
    if(result.alignment_accuracy_90){
        str+="Alignment accuracy 90 : "+result.alignment_accuracy_90+"\n";
    }
    if(result.weight){
        str+="Weight : "+result.weight+"\n";
    }else{
        str+="No molecular weight information\n";
    }
    str+="\n";
    str+="Number of results : "+rankingLength+"\n";
    str+=result.equivalent_carbons+"\n";
    str+="\n";

    return str;
}

/**
 * 
 * @param {*} array 
 * @returns string all elements with 2 decimal places
 */
function arrayToStrShifts(array){
    let str="";
    array.forEach(element=>{
        str+=""+element.toFixed(2)+"    ";
    })
    return str;
}
/**
 * 
 * @param {*} array 
 * @returns string all elements with 6 decimal places
 */
function arrayToStrIntensities(array){
    let str="";
    array.forEach(element=>{
        str+=""+element.toFixed(6)+"    ";
    })
    return str;
}

/**
 * download one or multiple png file with an max of 25 moleculs in one file
 * @param {*} ranking 
 * @param {*} name 
 */
async function saveImg(ranking,name){
    //count the number of pages
    let nbPages=Math.floor(ranking.length/25);
    if(nbPages*25<ranking.length){
        nbPages++;
    }

    let canvas=null;
    for (let k=1;k<=nbPages;k++){
        /**
         * each page have white background of 1750*3000 pixels
         */
        canvas = document.createElement('canvas');
        let ctx = canvas.getContext("2d");
        canvas.width=1750;
        canvas.height=3000;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,1750,3000);
        ctx.fillStyle = "#000000";
        let font=20;
        ctx.font = font+"px Arial"; 
        for(let j=0;j<5;j++){
            for(let i=0;i<5;i++){
                /**
                 * for each place add one molecul image with important infos
                 */
                //i 350 colonne, j 600 ligne
                let colonne=350*i+10;//
                let ligne=600*j+50;
                let rank=i+j*5+25*(k-1);
                let element=ranking[rank];
                if(element){
                    let canvasMol=getCanvasMol(element);
                    if(canvasMol){
                        ctx.drawImage(canvasMol, colonne, ligne,350,300); // draw image in the main canvas
                        ligne +=350+10;//add size of the image + space 
                        /**
                         * add information below the image 
                         */
                        let legend="Rank: "+(rank+1)+" MW:"+element.mw;
                        ctx.fillText(legend, colonne,ligne);
                        legend =element.name;
                        ligne+=font;
                        if(legend.length<23){                       
                            ctx.fillText(legend, colonne,ligne); 
                        }else{
                            if(element.cas){
                                ctx.fillText(element.cas, colonne,ligne);
                            }
                            else{
                                ctx.fillText(element.id,colonne,ligne);
                            }
                        }
                        legend ="Score: "+element.score;
                        ligne+=font;
                        ctx.fillText(legend, colonne,ligne); 
                        legend ="Deviation : "+element.error;
                        ligne+=font;
                        ctx.fillText(legend, colonne,ligne); 
                    }
                }
            }
        }
        //download the canvas
        var element = document.createElement('a');
        element.href = canvas.toDataURL("image/png");
        element.download = "["+k+"]ResultImage-"+name+".PNG";

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    
    
}

/**
 * 
 * @param {*} molecule 
 * @returns canvas with the image of the molecul
 */
function getCanvasMol(molecule){
    let Uint8Array=Buffer.from(molecule.base64, 'base64');
    const mol = window.RDKit.get_mol_from_uint8array(Uint8Array || "invalid");

    if (!!mol && mol.is_valid()) {
      const canvas = document.createElement("canvas");
      canvas.width=350;
      canvas.height=300;
      mol.draw_to_canvas_with_highlights(canvas, getMolDetails(molecule));
      return canvas;
    }
    return null;
}

/**
 * 
 * @param {*} molecule 
 * @returns json of molecul details
 */
function getMolDetails(molecule){
    let extraDetails=null;
    if(molecule.matched_sdf_atoms_idx){
        extraDetails={
            'atoms' :molecule.matched_sdf_atoms_idx,
            'addAtomIndices':true,
            'atomLabels':true,
            'highlightRadius' : 0.3
        };
    }
    let MOL_DETAILS = {
        width: 350,
        height: 300,
        bondLineWidth: 1,
        addStereoAnnotation: true
    };

    return JSON.stringify({
        ...MOL_DETAILS,
        ...(extraDetails || {})
      });

}

  
  