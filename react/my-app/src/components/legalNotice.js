import "../styles/legalNotice.scss";

function LegalNotice()
{
    const hebergeur = ""
    const raisonSociale = ""
    const adress = ""
    const phone = ""

    return(
        <div className='legal-container'>
            <h1>Mentions légales</h1>
            <p>Hébergeur : {hebergeur}</p>
            <p>Raison sociale : {raisonSociale}</p>
            <p>Adresse : {adress}</p>
            <p>Téléphone : {phone}</p>
        </div>
    )
}

export default LegalNotice;
