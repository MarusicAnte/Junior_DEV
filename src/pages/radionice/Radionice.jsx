import { useContext, useState, useEffect } from "react";
import Filter from "../../components/filter/Filter";
import Kartica from "../../components/kartice/Kartica";
import style from "./Radionice.module.css"
import axios from "axios";
import FilterItem from "../../components/filter/FilterItem";
import UserContext from "../../kontekst";
import KreirajRadionicu from "../../components/akcije/kreiraj/KreirajRadionicu";

function Radionice() {
    const logiraniKorisnik = useContext(UserContext);

    const [radionice, postaviRadionice] = useState([]);
    const [teme, postaviTeme] = useState([]);
    const [tezine, postaviTezine] = useState([]);
    const [otvorenModal, postaviOtvorenModal] = useState(false)
    const [azurirajPrikaz, postaviAzurirajPrikaz] = useState(false);
    const [filter, postaviFilter] = useState({
        odabraneTeme: [],
        odabraneTezine: []
    });

    console.log(filter.odabraneTeme);
    console.log(filter.odabraneTezine);

    const sortirajRadionice = (nizRadionica) => {
        return nizRadionica.sort((a, b) => a.ime.localeCompare(b.ime));
    }


    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:3001/teme"),
            axios.get("http://localhost:3001/tezine"),
        ])
            .then(([rezTeme, rezTezine]) => {
                postaviTeme(rezTeme.data);
                postaviTezine(rezTezine.data);
            })
            .catch(error => console.log(error.message));
    }, [])


    useEffect(() => {
        if (azurirajPrikaz) {
            axios.get("http://localhost:3001/radionice")
                .then(res => postaviRadionice(res.data))
                .catch(error => console.log(error.message))
        }
    }, [azurirajPrikaz])


    const izbrisiRadionicu = (idRadionice) => {
        const potvrda = window.confirm("Jeste li sigurni da želite izbrisati ovu radionicu?");
        if (potvrda) {
            axios.delete(`http://localhost:3001/radionice/${idRadionice}`)
                .then(() => {
                    axios.get("http://localhost:3001/radionice")
                        .then(res => postaviRadionice(res.data))
                        .catch(error => console.log(error.message))
                })
                .catch(error => console.log(error.message));
        }
    }


    useEffect(() => {
        const dohvatiRadionice = async () => {
            const res = await axios.get("http://localhost:3001/radionice");

            console.log("Filter: ", filter);

            // Filtriranje po temama i po težinama istovremeno
            if (filter.odabraneTeme.length > 0 && filter.odabraneTezine.length > 0) {
                postaviRadionice(res.data.filter(x => {
                    const filtriraneTeme = filter.odabraneTeme.includes(x.tema);
                    const filtriraneTezine = filter.odabraneTezine.includes(x.tezina);
                    return filtriraneTeme && filtriraneTezine;
                }));
            }
            // Filtriranje samo po temama
            else if (filter.odabraneTeme.length > 0) {
                postaviRadionice(res.data.filter(x => filter.odabraneTeme.includes(x.tema)));
            }
            // Filtriranje samo po težinama
            else if (filter.odabraneTezine.length > 0) {
                postaviRadionice(res.data.filter(x => filter.odabraneTezine.includes(x.tezina)));
            }
            // Bez filtriranja
            else {
                postaviRadionice(res.data);
            }
        }

        dohvatiRadionice();
    }, [filter]);


    return (
        <div className={style.background}>
            {
                otvorenModal &&
                <KreirajRadionicu
                    otvorenModal={otvorenModal}
                    postaviOtvorenModal={postaviOtvorenModal}
                    postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                />
            }
            {
                logiraniKorisnik === 'admin' &&
                <button className={style.addNew} onClick={() => postaviOtvorenModal(true)}>Dodaj novu radionicu</button>

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
                    <Filter naslov="Težine">
                        {tezine.map(tezina => (
                            <FilterItem
                                key={tezina.id}
                                kategorija="tezine"
                                ime={tezina.ime}
                                filtrirajOpcije={postaviFilter}
                            />
                        ))}
                    </Filter>
                </div>
                <div className={style.cardsContainer}>
                    {sortirajRadionice(radionice).map(radionica => (
                        <Kartica
                            id={radionica.id}
                            key={radionica.id}
                            logo={radionica.logo}
                            ime={radionica.ime}
                            brojPrijava={radionica.broj_prijava}
                            predavac={radionica.predavac}
                            organizacije={radionica.organizacije}
                            opis={radionica.opis}
                            tezina={radionica.tezina}
                            datum={radionica.datum}
                            izbrisiRadionicu={izbrisiRadionicu}
                            postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Radionice;
