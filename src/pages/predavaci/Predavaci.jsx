import { useEffect, useState, useContext } from "react";
import style from "./Predavaci.module.css"
import Filter from "../../components/filter/Filter";
import axios from "axios";
import FilterItem from "../../components/filter/FilterItem";
import PredavacKartica from "../../components/kartice/PredavacKartica";
import UserContext from "../../kontekst";
import KreirajPredavaca from "../../components/akcije/kreiraj/KreirajPredavaca";
import UrediPredavaca from "../../components/akcije/uredi/UrediPredavaca";

function Predavaci() {

    const logiraniKorisnik = useContext(UserContext);

    const [teme, postaviTeme] = useState([]);
    const [organizacije, postaviOrganizacije] = useState([]);
    const [predavaci, postaviPredavace] = useState([]);
    const [otvorenModal, postaviOtvorenModal] = useState(false)
    const [azurirajPrikaz, postaviAzurirajPrikaz] = useState(false);

    const [filter, postaviFilter] = useState({
        odabraneTeme: [],
        odabraneOrganizacije: []
    });

    useEffect(() => {
        axios.get("http://localhost:3001/predavaci")
            .then(res => postaviPredavace(res.data))
            .catch(error => console.log(error.message))
    }, [azurirajPrikaz])


    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:3001/teme"),
            axios.get("http://localhost:3001/organizacije"),
        ])
            .then(([rezTeme, rezOrganizacije]) => {
                postaviTeme(rezTeme.data);
                postaviOrganizacije(rezOrganizacije.data);
            })
            .catch(error => console.log(error.message));
    }, [])


    useEffect(() => {
        axios.get("http://localhost:3001/predavaci")
            .then(res => postaviPredavace(res.data))
            .catch(error => console.log(error.message))
    }, [])


    useEffect(() => {
        const dohvatiPredavace = async () => {
            const res = await axios.get("http://localhost:3001/predavaci");

            // Filtriranje po temama i po težinama istovremeno
            if (filter.odabraneTeme.length > 0 && filter.odabraneOrganizacije.length > 0) {
                postaviPredavace(res.data.filter(x => {
                    const filtriraneTeme = x.tema?.some(t => filter.odabraneTeme.includes(t));
                    const filtriraneOrganizacije = filter.odabraneOrganizacije.includes(x.organizacija);
                    return filtriraneTeme && filtriraneOrganizacije;
                }));
            }
            // Filtriranje samo po temama
            else if (filter.odabraneTeme.length > 0) {
                postaviPredavace(res.data.filter(x => x.tema?.some(t => filter.odabraneTeme.includes(t))));
            }
            // Filtriranje samo po težinama
            else if (filter.odabraneOrganizacije.length > 0) {
                postaviPredavace(res.data.filter(x => filter.odabraneOrganizacije.includes(x.organizacija)));
            }
            // Bez filtriranja
            else {
                postaviPredavace(res.data);
            }
        }

        dohvatiPredavace();
    }, [filter]);


    const sortirajPredavace = (predavaci) => {
        return predavaci.sort((a, b) => a.ime.localeCompare(b.ime));
    }


    return (
        <div className={style.background}>
            {
                otvorenModal &&
                <KreirajPredavaca
                    otvorenModal={otvorenModal}
                    postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                    postaviOtvorenModal={postaviOtvorenModal}
                />
            }
            {
                logiraniKorisnik === "admin" && <button className={style.addNew} onClick={() => postaviOtvorenModal(true)}>Dodaj novog predavača</button>
            }
            <div className={style.page}>
                <div className={style.filterContainer}>
                    <Filter naslov="Teme">
                        {teme.map(tema => (
                            <FilterItem
                                key={tema.id}
                                kategorija="teme"
                                ime={tema.ime}
                                filtrirajOpcije={postaviFilter}
                            />
                        ))}
                    </Filter>

                    <Filter naslov="Organizacije">
                        {organizacije.map(organizacija => (
                            <FilterItem
                                key={organizacija.id}
                                kategorija="organizacije"
                                ime={organizacija.ime}
                                filtrirajOpcije={postaviFilter}
                            />
                        ))}
                    </Filter>
                </div>

                <div className={style.instructorsContainer}>
                    {
                        sortirajPredavace(predavaci).map(predavac => (
                            <PredavacKartica
                                key={predavac.id}
                                id={predavac.id}
                                slikaURL={predavac.slikaURL}
                                ime={predavac.ime}
                                biografija={predavac.biografija}
                                organizacija={predavac.organizacija}
                                tema={predavac.tema}
                                postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Predavaci;
