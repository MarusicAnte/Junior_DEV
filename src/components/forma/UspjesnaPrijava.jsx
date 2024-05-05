import style from "./Forma.module.css"

function UspjesnaPrijava({ imePrezime, email, razlogPrijave, akcija, postaviUspjesnuPrijavu }) {

    const zatvoriModal = () => {
        akcija(false);
        postaviUspjesnuPrijavu(false);
    }

    return (
        <div className={style.successfulLogin}>
            <h1>Hvala na prijavi !</h1>
            <div className={style.dataContainer}>
                <h3>Podaci prijave</h3>
                <p><strong>Ime: </strong> {imePrezime}</p>
                <p><strong>Email: </strong> {email}</p>
                <p><strong>Razlog prijave: </strong>{razlogPrijave}</p>
            </div>
            <button onClick={zatvoriModal}>Natrag na radionice</button>
        </div>
    );
}

export default UspjesnaPrijava;