import AdminHeader from "../../components/adminHeader/AdminHeader";
import Tablica from "../../components/tablica/Tablica";
import { useState, useEffect } from "react";
import axios from "axios";
import style from "./Administracija.module.css"
import RedakOrganizacije from "../../components/tablica/RedakOrganizacije";


function Organizacije() {

    const [organizacije, postaviOrganizacije] = useState([])


    useEffect(() => {
        axios.get("http://localhost:3001/organizacije")
            .then(res => postaviOrganizacije(res.data))
            .catch((error) => console.log(error.message));
    }, [])


    const sortirajOrganizacije = (organizacije) => {
        return organizacije.sort((a, b) => a.ime.localeCompare(b.ime));
    }

    return (
        <div className={style.adminPage}>
            <AdminHeader />

            <Tablica stupac1="Organizacija" stupac2="Opis" stupac3="Radionice" stupac4="Predavači" kategorija="organizacije">
                {Array.isArray(organizacije) ? (
                    sortirajOrganizacije(organizacije).map(organizacija => (
                        <RedakOrganizacije
                            key={organizacija.id}
                            ime={organizacija.ime}
                            opis={organizacija.opis}
                            radionice={organizacija.radionice}
                            predavaci={organizacija.predavaci}
                        />
                    ))
                ) : (
                    <RedakOrganizacije
                        key={organizacije.id}
                        ime={organizacije.ime}
                        opis={organizacije.opis}
                        radionice={organizacije.radionice}
                        predavaci={organizacije.predavaci}
                    />
                )}
            </Tablica>
        </div>
    );
}

export default Organizacije;