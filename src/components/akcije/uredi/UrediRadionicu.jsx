import style from "./Uredi.module.css";
import Input from "../kreiraj/Input";
import TextArea from "../kreiraj/TextArea";
import Select from "react-select";
import axios from "axios";
import { useEffect, useState } from "react";

function UrediRadionicu({ idRadionice, postaviUrediModal, postaviAzurirajPrikaz }) {

    const [radionica, postaviRadionicu] = useState({});
    const [predavaci, postaviPredavace] = useState([]);
    const [organizacije, postaviOrganizacije] = useState([]);
    const [teme, postaviTeme] = useState([]);
    const [tezine, postaviTezine] = useState([]);
    const [logoSlike, postaviLogoSlike] = useState([]);

    const [objektPredavaci, postaviObjektPredavaca] = useState([]);
    const [objektOrganizacije, postaviObjektOrganizacije] = useState([]);
    const [objektTema, postaviObjektTema] = useState([]);
    const [objektTezina, postaviObjektTezina] = useState([]);
    const [odabraniPredavaci, postaviOdabranePredavace] = useState([]);
    const [odabraneOrganziacije, postaviOdabraneOrganizacije] = useState([]);
    const [odabraneTema, postaviOdabraneTemu] = useState([]);
    const [odabranaTezina, postaviOdabranuTezinu] = useState([]);

    const [staraRadionica, postaviStaruRadionicu] = useState("");


    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:3001/predavaci"),
            axios.get("http://localhost:3001/organizacije"),
            axios.get("http://localhost:3001/teme"),
            axios.get("http://localhost:3001/tezine"),
            axios.get("http://localhost:3001/logo"),
        ])
            .then(([rezPredavaci, rezOrganizacije, rezTeme, rezTezine, rezLogoSlike]) => {
                postaviPredavace(rezPredavaci.data);
                postaviOrganizacije(rezOrganizacije.data);
                postaviTeme(rezTeme.data);
                postaviTezine(rezTezine.data);
                postaviLogoSlike(rezLogoSlike.data);
            })
            .catch((error) => console.log(error.message));
    }, []);

    console.log(radionica);

    useEffect(() => {
        axios
            .get(`http://localhost:3001/radionice/${idRadionice}`)
            .then(res => {
                postaviRadionicu(res.data)
                postaviStaruRadionicu(res.data.ime);
            })
            .catch(error => console.log(error.message))
    }, [idRadionice])


    const handlePromjenaPredavaca = (opcija) => {
        let selektiraneOpcije = opcija.map(x => x.value);
        postaviOdabranePredavace(opcija);
        postaviRadionicu(prev => ({ ...prev, predavac: selektiraneOpcije }));
    }


    const handlePromjenaOrganizacija = (opcija) => {
        let selektiraneOpcije = opcija.map(x => x.value);
        postaviOdabraneOrganizacije(opcija);
        postaviRadionicu(prev => ({ ...prev, organizacije: selektiraneOpcije }));
    }


    const handlePromjenaTeme = (opcija) => {
        let selektiraneOpcije = opcija.label;
        postaviOdabraneTemu(opcija);
        postaviRadionicu(prev => ({ ...prev, tema: selektiraneOpcije }));
    }


    const handlePromjenaTezine = (opcija) => {
        let selektiraneOpcije = opcija.label;
        postaviOdabranuTezinu(opcija);
        postaviRadionicu(prev => ({ ...prev, tezina: selektiraneOpcije }));
    }


    const provjeraDatuma = (datum) => {
        const ispravanDatum = /^(\d{1,2})\.(\d{1,2})\.\d{4}$/.test(datum);
        return ispravanDatum;
    };


    const promjeniRadionicuOrganizacijama = () => {
        organizacije.map(async item => {
            const indexRadionice = item.radionice.indexOf(staraRadionica);

            if (indexRadionice >= 0) {
                item.radionice[indexRadionice] = radionica.ime;
                await axios.patch(`http://localhost:3001/organizacije/${item.id}`,
                    {
                        radionice: item.radionice
                    });
            }
        })
    }



    const spremiIzmjene = async () => {
        postaviAzurirajPrikaz(false);

        if (
            radionica.ime === "" ||
            !provjeraDatuma(radionica.datum) ||
            radionica.tezina === "" ||
            radionica.predavac.length === 0 ||
            radionica.organizacije.length === 0 ||
            radionica.opis === ""
        ) {
            alert("Forma nije ispravno popunjena. Molimo popunite sva polja !");
        } else {
            const logo = logoSlike.find(logo => logo.id === radionica.tema)
            const kopiranaRadionica = { ...radionica };
            kopiranaRadionica.logo = logo.url;

            axios.patch(`http://localhost:3001/radionice/${idRadionice}`, kopiranaRadionica)
                .then(() => {

                    promjeniRadionicuOrganizacijama();

                    postaviUrediModal(false);
                    postaviAzurirajPrikaz(true)
                })
                .catch(error => console.log(error.message))
        }
    };


    useEffect(() => {
        let objekti = predavaci.map(x => (
            {
                value: x.ime,
                label: x.ime
            }
        ));
        postaviObjektPredavaca(objekti);
    }, [predavaci]);


    useEffect(() => {
        let objekti = organizacije.map(x => (
            {
                value: x.ime,
                label: x.ime
            }
        ));
        postaviObjektOrganizacije(objekti);
    }, [organizacije]);


    useEffect(() => {
        let objekti = tezine.map(x => (
            {
                value: x.id,
                label: x.ime
            }
        ));
        postaviObjektTezina(objekti);
    }, [tezine])



    useEffect(() => {
        let objekti = teme.map(x => (
            {
                value: x.id,
                label: x.ime
            }
        ));
        postaviObjektTema(objekti);
    }, [teme])


    useEffect(() => {
        if (Object.keys(radionica).length !== 0) {
            let odabrane = {
                value: radionica.tema,
                label: radionica.tema
            }
            postaviOdabraneTemu(odabrane);
        }
    }, [radionica])


    useEffect(() => {
        if (Object.keys(radionica).length !== 0) {
            let odabrani = radionica.predavac.map(x => (
                {
                    value: x,
                    label: x
                }
            ));
            postaviOdabranePredavace(odabrani);
        }
    }, [radionica])

    useEffect(() => {
        if (Object.keys(radionica).length !== 0) {
            let odabrana = {
                value: radionica.tezina,
                label: radionica.tezina
            }
            postaviOdabranuTezinu(odabrana);
        }
    }, [radionica])

    useEffect(() => {
        if (Object.keys(radionica).length !== 0) {
            let odabrane = radionica.organizacije.map(x => (
                {
                    value: x,
                    label: x
                }
            ));
            postaviOdabraneOrganizacije(odabrane);
        }
    }, [radionica])


    return (
        <div className={style.createBackground}>
            <div className={style.createContainer}>
                <button className={style.backButton} onClick={() => postaviUrediModal(false)}>
                    X
                </button>

                <form className={style.createNewForm}>
                    <Input
                        name="Ime radionice"
                        value={radionica.ime ?? ""}
                        type="text"
                        id="ime"
                        placeholder="Unesite ime radionice..."
                        radionica={radionica}
                        setFunkcija={postaviRadionicu}
                    />

                    <Input
                        name="Datum održavanja"
                        value={radionica.datum ?? ""}
                        type="text"
                        id="datum"
                        placeholder="dd.mm.yyyy."
                        radionica={radionica}
                        setFunkcija={postaviRadionicu}
                    />

                    <TextArea
                        name="Opis"
                        id="opis"
                        value={radionica.opis}
                        radionica={radionica}
                        setFunkcija={postaviRadionicu}
                    />

                    <span>Odaberi predavače:</span>
                    <Select
                        options={objektPredavaci}
                        value={odabraniPredavaci}
                        isMulti={true}
                        onChange={handlePromjenaPredavaca}
                    />

                    <span>Odaberi organizacije:</span>
                    <Select
                        value={odabraneOrganziacije}
                        options={objektOrganizacije}
                        isMulti={true}
                        onChange={handlePromjenaOrganizacija}
                    />

                    <span>Odaberi temu:</span>
                    <Select
                        options={objektTema}
                        value={odabraneTema}
                        isMulti={false}
                        onChange={handlePromjenaTeme}
                    />

                    <span>Odaberi težinu:</span>
                    <Select
                        options={objektTezina}
                        value={odabranaTezina}
                        isMulti={false}
                        onChange={handlePromjenaTezine}
                    />
                </form>
                <button className={style.saveButton} onClick={spremiIzmjene}>
                    SPREMI
                </button>
            </div>
        </div>
    );
}

export default UrediRadionicu;
