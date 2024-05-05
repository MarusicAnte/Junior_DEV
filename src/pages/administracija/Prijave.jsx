import AdminHeader from "../../components/adminHeader/AdminHeader";
import { useState, useEffect } from "react";
import axios from "axios";
import Tablica from "../../components/tablica/Tablica";
import RedakPrijave from "../../components/tablica/RedakPrijave";
import UrediPrijave from "../../components/akcije/uredi/UrediPrijave";
import style from "./Administracija.module.css"

function Prijave() {

    const [prijave, postaviPrijave] = useState([]);
    const [urediRedakTablice, postaviUrediRedakTablice] = useState(false);
    const [idPrijave, postaviIdPrijave] = useState("");
    const [idKartice, postaviIdKartice] = useState("");
    const [azurirajPrikaz, postaviAzurirajPrikaz] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:3001/prijave")
            .then(res => postaviPrijave(res.data))
            .catch((error) => console.log(error.message));
    }, [])


    useEffect(() => {
        if (azurirajPrikaz) {
            axios.get("http://localhost:3001/prijave")
                .then(res => postaviPrijave(res.data))
                .catch((error) => console.log(error.message));
        }
    }, [azurirajPrikaz])

    const sortirajPrijave = (prijave) => {
        return prijave.sort((a, b) => a.imeKartice.localeCompare(b.imeKartice));
    }

    return (
        <div className={style.adminPage}>
            <AdminHeader />

            {
                urediRedakTablice &&
                <UrediPrijave
                    idKartice={idKartice}
                    idPrijave={idPrijave}
                    postaviUrediRedakTablice={postaviUrediRedakTablice}
                />
            }

            <Tablica stupac1="Radionica" stupac2="Korisnik" stupac3="Email" stupac4="Razlog prijave">
                {Array.isArray(prijave) ? (
                    sortirajPrijave(prijave).map(prijava => (
                        <RedakPrijave
                            key={prijava.id}
                            prijavaID={prijava.id}
                            imeKartice={prijava.imeKartice}
                            karticaID={prijava.idKartice}
                            imeKorisnika={prijava.imePrezime}
                            email={prijava.email}
                            razlogPrijave={prijava.razlogPrijave}
                            postaviUrediRedakTablice={postaviUrediRedakTablice}
                            postaviIdPrijave={postaviIdPrijave}
                            postaviIdKartice={postaviIdKartice}
                            postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                        />
                    ))
                ) : (
                    <RedakPrijave
                        key={prijave.id}
                        prijavaID={prijave.id}
                        imeKartice={prijave.imeKartice}
                        karticaID={prijave.idKartice}
                        imeKorisnika={prijave.imePrezime}
                        email={prijave.email}
                        razlogPrijave={prijave.razlogPrijave}
                        postaviUrediRedakTablice={postaviUrediRedakTablice}
                        postaviIdPrijave={postaviIdPrijave}
                        postaviIdKartice={postaviIdKartice}
                        postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                    />
                )}
            </Tablica>
        </div>
    );
}

export default Prijave;
