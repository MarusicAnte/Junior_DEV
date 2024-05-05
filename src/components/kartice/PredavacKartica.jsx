import { useEffect, useState, useContext } from "react";
import style from "./Kartica.module.css"
import KarticaInfo from "./KarticaInfo";
import UserContext from "../../kontekst";
import UrediPredavaca from "../akcije/uredi/UrediPredavaca";
import axios from "axios";
import { Link } from "react-router-dom";

function PredavacKartica({ id, slikaURL, ime, biografija, organizacija, tema, postaviAzurirajPrikaz }) {

    const logiraniKorisnik = useContext(UserContext)

    const [urediModal, postaviUrediModal] = useState(false);
    const [organizacije, postaviOrganizacije] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/organizacije")
            .then(res => postaviOrganizacije(res.data))
            .catch(error => console.log(error.message))
    }, [])



    const makniPredavacaIzOrganizacije = (imePredavaca, imeOrganizacije) => {
        organizacije.forEach(item => {
            if (item.ime === imeOrganizacije) {
                const azuriraniPredavaci = item.predavaci.filter(predavac => predavac !== imePredavaca);
                axios.patch(`http://localhost:3001/organizacije/${item.id}`,
                    {
                        predavaci: azuriraniPredavaci
                    }
                )
                    .then(res => console.log(res.data))
                    .catch(error => console.log(error.message))
            }
        })
    }


    const dohvatiPredavacaZaBrisanje = () => {
        const potvrdaBrisanja = window.confirm(`Želite li izbrisati predavača ${ime} ?`);
        if (potvrdaBrisanja) {
            axios.delete(`http://localhost:3001/predavaci/${id}`)
                .then(res => {
                    organizacije.forEach(dohvacenaOrganizacija => {
                        makniPredavacaIzOrganizacije(ime, organizacija);
                    })
                    console.log(res)
                    postaviAzurirajPrikaz(true);
                })
                .catch(error => console.log(error.message));
        }
    }

    return (
        <>
            {
                urediModal &&
                <UrediPredavaca
                    idPredavaca={id}
                    postaviUrediModal={postaviUrediModal}
                    postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                />
            }

            <div className={style.instructorCard}>
                <div className={style.imageContainer}>
                    <img src={slikaURL} alt="radionica-logo" className={style.instructorImg} />
                </div>

                <div className={style.instructorInfo}>
                    <h3 className={style.instructorName}>{ime}</h3>

                    <KarticaInfo info="Bio" sadrzaj={biografija} />
                    <KarticaInfo info="Organizacija" sadrzaj={organizacija} />
                    <KarticaInfo info="Teme" sadrzaj={tema?.map(x => x)} />

                    <div className={style.instructorButtons}>
                        <Link to={`/predavaci/${id}`} className={style.viewBtn}>Pregledaj radionice</Link>
                        {
                            logiraniKorisnik === "admin" &&
                            <>
                                <button className={style.updateBtn} onClick={() => postaviUrediModal(true)}>Uredi</button>
                                <button className={style.instructorDeleteBtn} onClick={dohvatiPredavacaZaBrisanje}>Izbriši</button>
                            </>
                        }

                    </div>
                </div>
            </div>
        </>
    );
}

export default PredavacKartica;