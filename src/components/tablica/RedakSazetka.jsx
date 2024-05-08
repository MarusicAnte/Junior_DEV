import axios from "axios";
import style from "./Tablica.module.css"


function RedakSazetka({ id, tema, slika, teme, organizacija, kategorija, ime, brojPrijava, datum,
    postaviIdOdabraneRadionice, postaviUrediModal, postaviIdOdabranogPredavaca, postaviAzurirajPrikaz }) {

    const handleUrediTablicu = () => {
        if (kategorija === "radionica") {
            postaviUrediModal(true);
            postaviIdOdabraneRadionice(id);
        } else {
            postaviUrediModal(true);
            postaviIdOdabranogPredavaca(id);
        }
    }

    const izbrisiRedakTablice = () => {
        if (kategorija === "radionica") {
            const potvrda = window.confirm("Jeste li sigurni da želite izbrisati radionicu ?");
            if (potvrda) {
                axios.delete(`http://localhost:3001/radionice/${id}`)
                    .then(() => postaviAzurirajPrikaz(true))
                    .catch(error => console.log(error.message))
            }
        } else {
            const potvrda = window.confirm("Jeste li sigurni da želite izbrisati predavača ?");
            if (potvrda) {
                axios.delete(`http://localhost:3001/predavaci/${id}`)
                    .then(() => postaviAzurirajPrikaz(true))
                    .catch(error => console.log(error.message))
            }
        }

    }


    const formatirajNiz = (niz) => {
        return niz.join(", ");
    }

    return (
        <tr>
            <td>{ime}</td>
            <td>
                {kategorija === "radionica" ? tema : <img src={slika} alt="slika-predavaca" className={style.tableImg} />}
            </td>
            <td>
                {kategorija === "radionica" ? brojPrijava : organizacija}
            </td>
            <td>
                {kategorija === "radionica" ? datum : formatirajNiz(teme)}
            </td>
            <td>
                <button className={style.tableUpdateBtn} onClick={handleUrediTablicu}>Uredi</button>
                <button className={style.tableDeleteBtn} onClick={izbrisiRedakTablice}>X</button>
            </td>
        </tr>
    );
}

export default RedakSazetka;