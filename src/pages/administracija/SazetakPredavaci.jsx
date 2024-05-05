import style from "./Administracija.module.css"
import Tablica from "../../components/tablica/Tablica";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import RedakSazetka from "../../components/tablica/RedakSazetka";
import axios from "axios";
import { useEffect, useState } from "react";
import UrediPredavaca from "../../components/akcije/uredi/UrediPredavaca";

function SazetakPredavaci() {

    const [predavaci, postaviPredavace] = useState([]);
    const [urediModal, postaviUrediModal] = useState(false);
    const [idOdabranogPredavaca, postaviIdOdabranogPredavaca] = useState("");
    const [azurirajPrikaz, postaviAzurirajPrikaz] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:3001/predavaci")
            .then(res => postaviPredavace(res.data))
            .catch((error) => console.log(error.message));
    }, [])

    const sortirajPredavace = (predavaci) => {
        return predavaci.sort((a, b) => a.ime.localeCompare(b.ime));
    }

    useEffect(() => {
        if (azurirajPrikaz) {
            axios.get("http://localhost:3001/predavaci")
                .then(res => postaviPredavace(res.data))
                .catch(error => console.log(error.message))
        }
    }, [azurirajPrikaz])

    return (
        <div className={style.adminPage}>
            <AdminHeader />

            {
                urediModal &&
                <UrediPredavaca
                    idPredavaca={idOdabranogPredavaca}
                    postaviUrediModal={postaviUrediModal}
                    postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                />
            }
            <Tablica stupac1="Ime predavača" stupac2="Slika predavača" stupac3="Organizacija" stupac4="Teme">
                {Array.isArray(predavaci) ? (
                    sortirajPredavace(predavaci).map(predavac => (
                        <RedakSazetka
                            key={predavac.id}
                            kategorija="predavac"
                            id={predavac.id}
                            ime={predavac.ime}
                            slika={predavac.slikaURL}
                            organizacija={predavac.organizacija}
                            teme={predavac.tema}
                            postaviUrediModal={postaviUrediModal}
                            postaviIdOdabranogPredavaca={postaviIdOdabranogPredavaca}
                            postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                        />
                    ))
                ) : (
                    <RedakSazetka
                        key={predavaci.id}
                        kategorija="predavac"
                        id={predavaci.id}
                        ime={predavaci.ime}
                        slika={predavaci.slikaURL}
                        organizacija={predavaci.organizacija}
                        teme={predavaci.tema}
                        postaviUrediModal={postaviUrediModal}
                        postaviIdOdabranogPredavaca={postaviIdOdabranogPredavaca}
                        postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                    />
                )}

            </Tablica>

        </div>
    );
}

export default SazetakPredavaci;