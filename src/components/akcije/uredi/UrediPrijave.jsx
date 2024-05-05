import { useEffect, useState } from "react";
import style from "./Uredi.module.css"
import FormaInput from "../../forma/FormaInput"
import TextArea from "../../forma/TextArea"
import axios from "axios";

function UrediPrijave({ idPrijave, postaviUrediRedakTablice }) {

    const [radionice, postaviRadionice] = useState([]);
    const [idTrazeneRadionice, postaviIdTrazeneRadionice] = useState("");

    const [formaPodaci, postaviPodatkeForme] = useState({
        id: "",
        idKartice: "",
        imeKartice: "",
        imePrezime: "",
        email: "",
        razlogPrijave: ""
    })

    const [validniPodaci, postaviValidnePodatke] = useState({
        validniNazivRadionice: true,
        validnoImePrezime: true,
        validniEmail: true,
        validniRazlogPrijave: true
    })

    useEffect(() => {
        axios.get("http://localhost:3001/radionice")
            .then(res => postaviRadionice(res.data))
            .catch(error => console.log(error.message));
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:3001/prijave/${idPrijave}`)
            .then(res => postaviPodatkeForme(res.data))
            .catch(error => console.log(error.message));
    }, [idPrijave])


    useEffect(() => {
        if (radionice.length > 0) {
            const trazenaRadionica = radionice.filter(radionica => radionica.id === formaPodaci.idKartice);
            const trazenaradionicaId = trazenaRadionica.map(r => r.id);

            postaviIdTrazeneRadionice(trazenaradionicaId);
        }
    }, [formaPodaci])

    const spremiPodatke = () => {
        if (
            validniPodaci.validniNazivRadionice &&
            validniPodaci.validnoImePrezime &&
            validniPodaci.validniEmail &&
            validniPodaci.validniRazlogPrijave
        ) {
            axios
                .patch(`http://localhost:3001/prijave/${idPrijave}`, formaPodaci)
                .then(() => {
                    if (idTrazeneRadionice !== "") {
                        axios
                            .patch(
                                `http://localhost:3001/radionice/${idTrazeneRadionice}`,
                                {
                                    ime: formaPodaci.imeKartice
                                }
                            )
                            .then(res => {
                                console.log(res.data)
                                postaviUrediRedakTablice(false);
                            })
                            .catch(error => console.log(error.message));
                    }
                    window.location.reload();
                })
                .catch(error => console.log(error.message));
        } else {
            alert("Forma nije ispravno popunjena. Molimo provjerite unose !");
            postaviUrediRedakTablice(true);
        }
    };


    return (
        <div className={style.createBackground}>
            <div className={style.createContainer}>
                <button className={style.backButton} onClick={() => postaviUrediRedakTablice(false)}>X</button>
                <div className={style.formContainer}>
                    <FormaInput
                        name="Ime radionice"
                        placeholder="Unesite ime radionice..."
                        type="text"
                        kategorija="radionica"
                        value={formaPodaci.imeKartice}
                        postaviFormu={postaviPodatkeForme}
                        validniPodatak={validniPodaci.validniNazivRadionice}
                        postaviValidnePodatke={postaviValidnePodatke}
                    />

                    <FormaInput
                        name="Ime i prezime"
                        placeholder="Unesite ime i prezime..."
                        type="text"
                        kategorija="ime"
                        value={formaPodaci.imePrezime}
                        postaviFormu={postaviPodatkeForme}
                        validniPodatak={validniPodaci.validnoImePrezime}
                        postaviValidnePodatke={postaviValidnePodatke}
                    />

                    <FormaInput
                        name="Email"
                        placeholder="Unesite email..."
                        type="email"
                        kategorija="email"
                        value={formaPodaci.email}
                        postaviFormu={postaviPodatkeForme}
                        validniPodatak={validniPodaci.validniEmail}
                        postaviValidnePodatke={postaviValidnePodatke}
                    />

                    <TextArea
                        name="Razlog prijave"
                        placeholder="Razlog prijave..."
                        value={formaPodaci.razlogPrijave}
                        postaviFormu={postaviPodatkeForme}
                        validniPodatak={validniPodaci.validniRazlogPrijave}
                        postaviValidnePodatke={postaviValidnePodatke}
                    />
                </div>
                <button className={style.saveButton} onClick={spremiPodatke}>Spremi</button>
            </div>
        </div>
    );
}

export default UrediPrijave;
