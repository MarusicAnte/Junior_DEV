import { useEffect, useState } from "react";
import style from "../../../pages/radionice/Radionice.module.css"
import Filter from "../../filter/Filter";
import FilterItem from "../../filter/FilterItem";
import Kartica from "../../kartice/Kartica";
import axios from "axios";
import { useParams } from "react-router-dom";

function PrikazRadionica() {

    const { id } = useParams();

    const [imePredavaca, postaviImePredavaca] = useState("");
    const [radionice, postaviRadionice] = useState([]);
    const [teme, postaviTeme] = useState([]);
    const [tezine, postavitezine] = useState([]);
    const [filter, postaviFilter] = useState({
        odabraneTeme: [],
        odabraneTezine: []
    });
    const [odabraneRadionice, postaviOdabraneRadionice] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:3001/radionice"),
            axios.get("http://localhost:3001/teme"),
            axios.get("http://localhost:3001/tezine"),
        ])
            .then(([rezRadionice, rezTeme, rezTezine]) => {
                postaviRadionice(rezRadionice.data)
                postaviTeme(rezTeme.data);
                postavitezine(rezTezine.data);
            })
            .catch(error => console.log(error.message));
    }, [])

    console.log(radionice);

    useEffect(() => {
        axios.get(`http://localhost:3001/predavaci/${id}`)
            .then(res => postaviImePredavaca(res.data.ime))
            .catch(error => console.log(error.message));
    }, [])


    useEffect(() => {
        if (radionice.length !== 0) {
            let filtriraneRadionice = radionice.filter(radionica => radionica.predavac.includes(imePredavaca));
            console.log("Filtrirane radionice: ", filtriraneRadionice);
            postaviOdabraneRadionice(filtriraneRadionice);
        }
    }, [radionice, imePredavaca]);


    const sortirajRadionice = (nizRadionica) => {
        return nizRadionica.sort((a, b) => a.ime.localeCompare(b.ime));
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
                    {sortirajRadionice(odabraneRadionice).map(radionica => (
                        <Kartica
                            id={radionica.id}
                            key={radionica.id}
                            logo={`../../../${radionica.logo}`}
                            ime={radionica.ime}
                            brojPrijava={radionica.broj_prijava}
                            predavac={radionica.predavac}
                            organizacije={radionica.organizacije}
                            opis={radionica.opis}
                            tezina={radionica.tezina}
                            datum={radionica.datum}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PrikazRadionica;