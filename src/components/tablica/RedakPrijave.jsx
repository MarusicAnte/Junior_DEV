import { useEffect, useState } from "react";
import style from "./Tablica.module.css"
import axios from "axios";

function RedakPrijave({ prijavaID, karticaID, imeKartice, imeKorisnika, email, razlogPrijave,
    postaviUrediRedakTablice, postaviIdPrijave, postaviIdKartice, postaviAzurirajPrikaz }) {

    const [radionice, postaviRadionice] = useState([]);
    const [idTrazeneRadionice, postaviIdTrazeneRadionice] = useState("");

    const [brojPrijava, postaviBrojPrijava] = useState([]);

    const handleUrediTablicu = () => {
        postaviIdPrijave(prijavaID);
        postaviIdKartice(idTrazeneRadionice);
        postaviUrediRedakTablice(true);
    }

    useEffect(() => {
        axios.get("http://localhost:3001/radionice")
            .then(res => postaviRadionice(res.data))
            .catch(error => console.log(error.message));
    }, [])


    useEffect(() => {
        axios.get(`http://localhost:3001/radionice/${karticaID}`)
            .then(res => {
                let objekt = {
                    idRadionice: res.data.id,
                    brojPrijava: res.data.broj_prijava,
                }
                postaviBrojPrijava(objekt);
            })
            .catch(error => console.log(error.message));
    }, [prijavaID])


    const izbrisiRedakTablice = () => {
        postaviAzurirajPrikaz(false);

        const potvrda = window.confirm("Jeste li sigurni da želite izbrisat prijavu ?");
        if (potvrda) {
            axios.delete(`http://localhost:3001/prijave/${prijavaID}`)
                .then(() => {
                    const broj = parseInt(brojPrijava.brojPrijava);
                    axios.patch(`http://localhost:3001/radionice/${karticaID}`,
                        {
                            broj_prijava: broj - 1
                        }
                    )
                        .then(() => postaviAzurirajPrikaz(true))
                        .catch(error => console.log(error.message));
                }
                )
                .catch(error => console.log(error.message))
        }
    }

    return (
        <tr>
            <td>{imeKartice}</td>
            <td>{imeKorisnika}</td>
            <td>{email}</td>
            <td>{razlogPrijave}</td>
            <td>
                <button className={style.tableUpdateBtn} onClick={handleUrediTablicu}>Uredi</button>
                <button className={style.tableDeleteBtn} onClick={izbrisiRedakTablice}>X</button>
            </td>
        </tr>

    );
}

export default RedakPrijave;