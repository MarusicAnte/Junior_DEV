import style from "./Administracija.module.css"
import Tablica from "../../components/tablica/Tablica";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import RedakSazetka from "../../components/tablica/RedakSazetka";
import UrediRadionicu from "../../components/akcije/uredi/UrediRadionicu";
import axios from "axios";
import { useEffect, useState } from "react";

function SazetakRadionica() {

    const [radionice, postaviRadionice] = useState([]);
    const [urediModal, postaviUrediModal] = useState(false);
    const [idOdabraneRadionice, postaviIdOdabraneRadionice] = useState("");
    const [azurirajPrikaz, postaviAzurirajPrikaz] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:3001/radionice")
            .then(res => postaviRadionice(res.data))
            .catch((error) => console.log(error.message));
    }, [])

    const sortirajRadionice = (radionice) => {
        return radionice.sort((a, b) => a.ime.localeCompare(b.ime));
    }

    useEffect(() => {
        if (azurirajPrikaz) {
            axios.get("http://localhost:3001/radionice")
                .then(res => postaviRadionice(res.data))
                .catch(error => console.log(error.message))
        }
    }, [azurirajPrikaz])


    return (
        <div className={style.adminPage}>
            <AdminHeader />
            {
                urediModal &&
                <UrediRadionicu
                    idRadionice={idOdabraneRadionice}
                    postaviUrediModal={postaviUrediModal}
                    postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                />
            }
            <Tablica stupac1="Ime radionice" stupac2="Tema radionice" stupac3="Broj prijava" stupac4="Datum">
                {Array.isArray(radionice) ? (
                    sortirajRadionice(radionice).map(radionica => (
                        <RedakSazetka
                            key={radionica.id}
                            kategorija="radionica"
                            id={radionica.id}
                            ime={radionica.ime}
                            tema={radionica.tema}
                            brojPrijava={radionica.broj_prijava}
                            datum={radionica.datum}
                            postaviUrediModal={postaviUrediModal}
                            postaviIdOdabraneRadionice={postaviIdOdabraneRadionice}
                            postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                        />
                    ))
                ) : (
                    <RedakSazetka
                        key={radionice.id}
                        kategorija="radionica"
                        logo={radionice.logo}
                        ime={radionice.ime}
                        tema={radionice.tema}
                        brojPrijava={radionice.broj_prijava}
                        datum={radionice.datum}
                        postaviUrediModal={postaviUrediModal}
                        postaviIdOdabraneRadionice={postaviIdOdabraneRadionice}
                        postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                    />
                )}

            </Tablica>

        </div>
    );
}

export default SazetakRadionica;