import { useEffect, useState } from "react";
import Input from "./Input";
import style from "./Kreiraj.module.css";
import Select from "react-select";
import TextArea from "./TextArea";
import axios from "axios";

function KreirajRadionicu({ otvorenModal, postaviOtvorenModal, postaviAzurirajPrikaz }) {
    const [predavaci, postaviPredavace] = useState([]);
    const [organizacije, postaviOrganizacije] = useState([]);
    const [teme, postaviTeme] = useState([]);
    const [tezine, postaviTezine] = useState([]);
    const [logoSlike, postaviLogoSlike] = useState([]);

    const [odabraniPredavaci, postaviOdabranePredavace] = useState([]);
    const [odabraneOrganizacije, postaviOdabraneOrganizacije] = useState([]);

    const [objektPredavaci, postaviObjektPredavace] = useState([]);
    const [objektOrganizacije, postaviObjektOrganizacije] = useState([]);
    const [objektTema, postaviObjektTema] = useState([]);
    const [objektTezina, postaviObjektTezina] = useState([]);


    const [novaRadionica, postaviNovuRadionicu] = useState({
        logo: "",
        ime: "",
        datum: "",
        predavac: [],
        organizacije: [],
        tema: "",
        tezina: "",
        opis: "",
        broj_prijava: 0,
    });

    // Mijenjanje stila body elementa ovisno o tome jeli modal otvoren ili ne.
    useEffect(() => {
        if (otvorenModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [otvorenModal]);

    useEffect(() => {
        postaviAzurirajPrikaz(false);

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

    const provjeraDatuma = (datum) => {
        const ispravanDatum = /^(\d{1,2})\.(\d{1,2})\.\d{4}$/.test(datum);
        return ispravanDatum;
    };


    const dodajRadionicuOrganizaciji = (organizacija, imeRadionice) => {
        let nizRadionica = [];
        let idOrganizacije = "";

        organizacije.forEach(item => {
            if (item.ime === organizacija) {
                nizRadionica = item.radionice;
                nizRadionica.push(imeRadionice);
                idOrganizacije = item.id;
                console.log("Niz radionica: ", organizacija, nizRadionica);
            }
        })

        axios.patch(`http://localhost:3001/organizacije/${idOrganizacije}`,
            {
                radionice: nizRadionica
            }
        )
            .then(res => console.log(res.data))
            .catch(error => console.log(error.message))
    }


    const dodajPredavacaOrganizaciji = (organizacija, nizNovihPredavaca) => {
        let nizPredavaca = [];
        let idOrganizacije = "";

        organizacije.forEach(item => {
            if (item.ime === organizacija) {
                nizPredavaca = Array.from(new Set([...item.predavaci, ...nizNovihPredavaca]))
                idOrganizacije = item.id
            }
        })

        axios.patch(`http://localhost:3001/organizacije/${idOrganizacije}`,
            {
                predavaci: nizPredavaca
            }
        )
            .then(res => console.log(res.data))
            .catch(error => console.log(error.message))
    }



    const spremiPodatkeRadionice = () => {
        console.log(odabraniPredavaci);

        if (
            novaRadionica.ime === "" ||
            !provjeraDatuma(novaRadionica.datum) ||
            novaRadionica.tezina === "" ||
            novaRadionica.tema === "" ||
            novaRadionica.predavac.length === 0 ||
            novaRadionica.organizacije.length === 0 ||
            novaRadionica.opis === ""
        ) {
            alert("Forma nije ispravno popunjena. Molimo popunite sva polja !");
            postaviAzurirajPrikaz(false);
        } else {
            const logo = logoSlike.find((logo) => logo.id === novaRadionica.tema);
            novaRadionica.logo = logo.url;

            axios
                .post("http://localhost:3001/radionice", novaRadionica)
                .then((response) => {

                    novaRadionica.organizacije.forEach(organizacija => {
                        dodajRadionicuOrganizaciji(organizacija, novaRadionica.ime);
                    })

                    novaRadionica.organizacije.forEach(organizacija => {
                        dodajPredavacaOrganizaciji(organizacija, novaRadionica.predavac);
                    })

                    console.log("Podaci spremljeni:", response.data);
                    postaviNovuRadionicu({
                        logo: "",
                        ime: "",
                        datum: "",
                        predavac: [],
                        organizacije: [],
                        tema: "",
                        tezina: "",
                        opis: "",
                        broj_prijava: 0,
                    });
                    postaviOtvorenModal(false);
                    postaviAzurirajPrikaz(true);
                })
                .catch((error) => {
                    console.log("Greška pri spremanju podataka:", error);
                });

        }
    };

    useEffect(() => {
        postaviNovuRadionicu(prev => ({
            ...prev,
            predavac: odabraniPredavaci,
            organizacije: odabraneOrganizacije
        }));
    }, [odabraniPredavaci, odabraneOrganizacije]);


    useEffect(() => {
        let objekti = predavaci.map(x => (
            {
                value: x.ime,
                label: x.ime
            }
        ))
        postaviObjektPredavace(objekti);
    }, [predavaci])


    useEffect(() => {
        let objekti = organizacije.map(x => (
            {
                value: x.ime,
                label: x.ime
            }
        ))
        postaviObjektOrganizacije(objekti);
    }, [organizacije])


    useEffect(() => {
        let objekti = teme.map(x => (
            {
                value: x.id,
                label: x.ime
            }
        ))
        postaviObjektTema(objekti);
    }, [teme])


    useEffect(() => {
        let objekti = tezine.map(x => (
            {
                value: x.id,
                label: x.ime
            }
        ))
        postaviObjektTezina(objekti);
    }, [tezine])


    useEffect(() => {
        let imenaOdabranihPredavaca = odabraniPredavaci.map(x => x.label);
        let imenaOdabranihOrganizacija = odabraneOrganizacije.map(x => x.label);

        postaviNovuRadionicu(prev => ({ ...prev, predavac: imenaOdabranihPredavaca, organizacije: imenaOdabranihOrganizacija }));
    }, [odabraniPredavaci, odabraneOrganizacije])


    return (
        <div className={style.createBackground}>
            <div className={style.createContainer}>
                <button className={style.backButton} onClick={() => postaviOtvorenModal(false)}>
                    X
                </button>

                <form className={style.createNewForm}>
                    <Input
                        name="Ime radionice"
                        id="ime"
                        value={novaRadionica.ime}
                        placeholder="Unesite ime radionice..."
                        setFunkcija={postaviNovuRadionicu}
                    />

                    <Input
                        name="Datum održavanja"
                        id="datum"
                        value={novaRadionica.datum}
                        placeholder="dd.mm.yyyy."
                        setFunkcija={postaviNovuRadionicu}
                    />

                    <TextArea
                        name="Opis"
                        id="opis"
                        setFunkcija={postaviNovuRadionicu}
                    />

                    <span>Odaberi predavače:</span>
                    <Select
                        options={objektPredavaci}
                        value={odabraniPredavaci}
                        onChange={(opcija) => postaviOdabranePredavace(opcija)}
                        isMulti={true}
                    />

                    <span>Odaberi organizacije:</span>
                    <Select
                        options={objektOrganizacije}
                        value={odabraneOrganizacije}
                        onChange={(opcija) => postaviOdabraneOrganizacije(opcija)}
                        isMulti={true}
                    />

                    <span>Odaberi temu:</span>
                    <Select
                        options={objektTema}
                        onChange={(opcija) => postaviNovuRadionicu(prev => ({ ...prev, tema: opcija.label }))}
                        isMulti={false}
                    />

                    <span>Odaberi težinu:</span>
                    <Select
                        options={objektTezina}
                        onChange={(opcija) => postaviNovuRadionicu(prev => ({ ...prev, tezina: opcija.label }))}
                        isMulti={false}
                    />
                </form>
                <button className={style.saveButton} onClick={spremiPodatkeRadionice}>
                    SPREMI
                </button>
            </div>
        </div>
    );
}

export default KreirajRadionicu;
