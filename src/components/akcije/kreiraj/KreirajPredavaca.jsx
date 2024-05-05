import style from "./Kreiraj.module.css"
import { useEffect, useState } from "react";
import Select from "react-select";
import Input from "./Input";
import TextArea from "./TextArea";
import axios from "axios";

function KreirajPredavaca({ postaviOtvorenModal, postaviAzurirajPrikaz }) {

    const [organizacije, postaviOrganizacije] = useState([]);
    const [teme, postaviTeme] = useState([]);
    const [organizacijeObjekt, postaviOrganizacijeObjekt] = useState([]);
    const [temeObjekt, postaviTemeObjekt] = useState([]);
    const [odabraneOrganizacije, postaviOdabraneOrganizacije] = useState([]);
    const [odabraneTeme, postaviOdabraneTeme] = useState([]);

    const [noviPredavac, postaviNovogPredavaca] = useState({
        ime: "",
        slikaURL: "",
        biografija: "",
        organizacija: "",
        tema: []
    })

    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:3001/organizacije"),
            axios.get("http://localhost:3001/teme"),
        ])
            .then(([rezOrganizacije, rezTeme]) => {
                postaviOrganizacije(rezOrganizacije.data);
                postaviTeme(rezTeme.data);
            })
            .catch((error) => console.log(error.message));
    }, [])

    const provjeraURLa = (url) => {
        const ispravanURL = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
        return ispravanURL;
    }


    const dodajPredavacaOrganizaciji = (organizacija, imePredavaca) => {
        let nizPredavaca = [];
        let idOrganizacije = "";

        organizacije.forEach(item => {
            if (item.ime === organizacija) {
                nizPredavaca = item.predavaci;
                nizPredavaca.push(imePredavaca);
                idOrganizacije = item.id;
                console.log("Niz predavaca za organizaciju ", organizacija, nizPredavaca);
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



    const spremiNovogPredavaca = () => {
        if (noviPredavac.ime === "" ||
            !provjeraURLa(noviPredavac.slikaURL) ||
            noviPredavac.biografija === "" ||
            noviPredavac.organizacija === "" ||
            noviPredavac.tema === "") {
            alert("Forma nije ispravno popunjena ! Provjerite unose.")
            postaviOtvorenModal(true);
            postaviAzurirajPrikaz(false);
        } else {
            axios.post("http://localhost:3001/predavaci", noviPredavac)
                .then((res) => {
                    dodajPredavacaOrganizaciji(noviPredavac.organizacija, noviPredavac.ime);

                    postaviNovogPredavaca({
                        ime: "",
                        slikaURL: "",
                        biografija: "",
                        organizacija: "",
                        tema: []
                    });
                    postaviOtvorenModal(false);
                    postaviAzurirajPrikaz(true);
                })
                .catch(error => console.log(error.message));
        }
    }

    useEffect(() => {
        postaviNovogPredavaca(prev => ({
            ...prev,
            organizacija: odabraneOrganizacije,
            tema: odabraneTeme
        }));
    }, [odabraneOrganizacije, odabraneTeme]);


    useEffect(() => {
        let objekt1 = organizacije.map(x => (
            {
                value: x.ime,
                label: x.ime
            }
        ));

        let objekt2 = teme.map(x => (
            {
                value: x.id,
                label: x.ime
            }
        ));

        postaviOrganizacijeObjekt(objekt1);
        postaviTemeObjekt(objekt2);
    }, [organizacije, teme])


    useEffect(() => {
        let imeOdabraneOrganizacije = odabraneOrganizacije.label;
        console.log("Ime odabrane org: ", imeOdabraneOrganizacije);
        let imenaOdabranihTema = odabraneTeme.map(x => x.label);

        postaviNovogPredavaca(prev => ({ ...prev, organizacija: imeOdabraneOrganizacije, tema: imenaOdabranihTema }));
    }, [odabraneTeme, odabraneOrganizacije])

    return (
        <div className={style.createBackground}>
            <div className={style.createContainer}>
                <button className={style.backButton} onClick={() => postaviOtvorenModal(false)}>
                    X
                </button>

                <form className={style.createNewForm}>
                    <Input
                        name="Ime predavača"
                        id="ime"
                        value={noviPredavac.ime}
                        placeholder="Unesite ime predavaca..."
                        setFunkcija={postaviNovogPredavaca}
                    />

                    <Input
                        name="URL slike:"
                        id="slika"
                        value={noviPredavac.slikaURL}
                        placeholder="https://xsgames.co/randomusers/assets/avatars/{male/female}/{BROJ}.jpg"
                        setFunkcija={postaviNovogPredavaca}
                    />

                    <TextArea
                        name="Biografija"
                        id="bio"
                        setFunkcija={postaviNovogPredavaca}
                    />

                    <span>Odaberi organizacije:</span>
                    <Select
                        options={organizacijeObjekt}
                        value={odabraneOrganizacije}
                        onChange={(opcija) => postaviOdabraneOrganizacije(opcija)}
                        isMulti={false}
                    />

                    <span>Odaberi temu:</span>
                    <Select
                        options={temeObjekt}
                        value={odabraneTeme}
                        onChange={(opcija) => postaviOdabraneTeme(opcija)}
                        isMulti={true}
                    />
                </form>
                <button className={style.saveButton} onClick={spremiNovogPredavaca}>
                    SPREMI
                </button>
            </div>
        </div>
    );
}

export default KreirajPredavaca;