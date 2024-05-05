import style from "./Uredi.module.css"
import Input from "../kreiraj/Input";
import TextArea from "../kreiraj/TextArea";
import Select from "react-select";
import axios from "axios";
import { useEffect, useState } from "react";

function UrediPredavaca({ idPredavaca, postaviUrediModal, postaviAzurirajPrikaz }) {

    const [predavac, postaviPredavaca] = useState({})

    const [organizacije, postaviOrganizacije] = useState([]);
    const [teme, postaviTeme] = useState([]);
    const [radionice, postaviRadionice] = useState([]);
    const [nizPredavaca, postaviNizPredavaca] = useState([]);

    const [organizacijeObjekt, postaviOrganizacijeObjekt] = useState([]);
    const [temeObjekt, postaviTemeObjekt] = useState([]);

    const [odabranaOrganizacija, postaviOdabranuOrganizaciju] = useState({});
    const [odabraneTeme, postaviOdabraneTeme] = useState([]);

    const [staroIme, postaviStaroIme] = useState("");

    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:3001/organizacije"),
            axios.get("http://localhost:3001/teme"),
            axios.get("http://localhost:3001/radionice"),
            axios.get("http://localhost:3001/predavaci")
        ])
            .then(([rezOrganizacije, rezTeme, rezRadionice, rezPredavaci]) => {
                postaviOrganizacije(rezOrganizacije.data);
                postaviTeme(rezTeme.data);
                postaviRadionice(rezRadionice.data)
                postaviNizPredavaca(rezPredavaci.data)
            })
            .catch((error) => console.log(error.message));
    }, []);


    useEffect(() => {
        axios.get(`http://localhost:3001/predavaci/${idPredavaca}`)
            .then(res => {
                postaviPredavaca(res.data)
                postaviStaroIme(res.data.ime)
            })
            .catch(error => console.log(error.message));
    }, [idPredavaca])


    useEffect(() => {
        if (Object.keys(predavac).length !== 0) {
            let objektOrganizacija = {
                value: predavac.organizacija,
                label: predavac.organizacija
            }

            let objektTeme = predavac.tema.map(x => (
                {
                    value: x,
                    label: x
                }
            ))

            postaviOdabranuOrganizaciju(objektOrganizacija);
            postaviOdabraneTeme(objektTeme);
        }
    }, [predavac])


    useEffect(() => {
        let objektOrganizacije = organizacije.map(x => (
            {
                value: x.id,
                label: x.ime
            }
        ))

        let objektTeme = teme.map(x => (
            {
                value: x.id,
                label: x.ime
            }
        ))

        postaviOrganizacijeObjekt(objektOrganizacije);
        postaviTemeObjekt(objektTeme);
    }, [organizacije, teme])


    const provjeraURLa = (url) => {
        const ispravanURL = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
        return ispravanURL;
    }



    const promjeniPredavacaOrganizacijama = () => {

        organizacije.map(async item => {
            const indexPredavaca = item.predavaci.indexOf(staroIme);

            if (indexPredavaca >= 0) {
                item.predavaci[indexPredavaca] = predavac.ime;
                await axios.patch(`http://localhost:3001/organizacije/${item.id}`, { predavaci: item.predavaci });
            }
        })
    }


    const promjeniPredavacaRadionicama = () => {

        radionice.map(async item => {
            const indexPredavaca = item.predavac.indexOf(staroIme);

            if (indexPredavaca >= 0) {
                item.predavac[indexPredavaca] = predavac.ime;
                await axios.patch(`http://localhost:3001/radionice/${item.id}`, { predavac: item.predavac });
            }
        })
    }


    const spremiPromjene = () => {
        postaviAzurirajPrikaz(false);

        if (predavac.ime === "" ||
            !provjeraURLa(predavac.slikaURL) ||
            predavac.biografija === "" ||
            predavac.organizacija === "" ||
            predavac.tema.length === 0
        ) {
            alert("Forma nije ispravo popunjena. Molimo provjerite unose !");
            postaviUrediModal(true);
        } else {
            axios.patch(`http://localhost:3001/predavaci/${idPredavaca}`, predavac)
                .then(() => {
                    promjeniPredavacaOrganizacijama();

                    promjeniPredavacaRadionicama();

                    postaviUrediModal(false);
                    postaviAzurirajPrikaz(true);
                })
                .catch(error => console.log(error.message));

            postaviUrediModal(false);
        }
    }

    return (
        <div className={style.createBackground}>
            <div className={style.createContainer}>
                <button className={style.backButton} onClick={() => postaviUrediModal(false)}>
                    X
                </button>

                <form className={style.createNewForm}>
                    <Input
                        name="Ime predavača"
                        id="ime"
                        value={predavac.ime ?? ""}
                        setFunkcija={postaviPredavaca}
                    />

                    <Input
                        name="URL slike:"
                        id="slika"
                        value={predavac.slikaURL ?? ""}
                        setFunkcija={postaviPredavaca}
                    />

                    <TextArea
                        value={predavac.biografija}
                        name="Biografija"
                        id="bio"
                        setFunkcija={postaviPredavaca}
                    />

                    <span>Odaberi organizacije:</span>
                    <Select
                        options={organizacijeObjekt}
                        value={odabranaOrganizacija}
                        onChange={(opcija) => postaviOdabranuOrganizaciju(opcija)}
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
                <button className={style.saveButton} onClick={spremiPromjene}>
                    SPREMI
                </button>
            </div>
        </div>
    );
}

export default UrediPredavaca;