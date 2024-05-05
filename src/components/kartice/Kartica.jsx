import style from "./Kartica.module.css"
import KarticaInfo from "./KarticaInfo";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../kontekst"
import Modal from "../modal/Modal";
import UrediRadionicu from "../akcije/uredi/UrediRadionicu"
import axios from "axios";


function Kartica({ id, logo, ime, brojPrijava, predavac, opis, tezina, organizacije, datum, izbrisiRadionicu, postaviAzurirajPrikaz }) {

    const logiraniKorisnik = useContext(UserContext);

    const [imenaPredavaca, postaviImenaPredavaca] = useState([]);
    const [imenaOrganizacija, postaviImenaOrganizacija] = useState([]);
    const [otvorenModal, postaviOtvorenModal] = useState(false);
    const [uspjesnaPrijava, postaviUspjesnuPrijavu] = useState(false);
    const [brojacPrijava, postaviBrojacPrijava] = useState(brojPrijava);
    const [urediRadionicu, postaviUrediRadionicu] = useState(false);

    useEffect(() => {
        const nizImenaPredavaca = predavac.map(x => x);
        const nizImenaOrganizacija = organizacije.map(y => y);
        postaviImenaPredavaca(nizImenaPredavaca);
        postaviImenaOrganizacija(nizImenaOrganizacija)
    }, [predavac, organizacije])

    useEffect(() => {
        axios.patch(`http://localhost:3001/radionice/${id}`,
            {
                broj_prijava: brojacPrijava
            })
            .then(res => console.log(""))
            .catch(error => console.log(""))
    }, [brojacPrijava])


    const dohvatiRadionicuZaBrisanje = () => {
        izbrisiRadionicu(id);

        organizacije.forEach(organizacija => {
            console.log("ORG: ", organizacija);
            console.log("IME: ", ime)
            makniRadionicuIzOrganizacije(organizacija, ime);
        })
    }


    const makniRadionicuIzOrganizacije = async (organizacija, imeRadionice) => {
        let dohvaceneOrganizacije;
        await axios.get("http://localhost:3001/organizacije")
            .then(res => dohvaceneOrganizacije = res.data)
            .catch(error => console.log(error.message));

        dohvaceneOrganizacije.forEach(item => {
            if (item.ime === organizacija) {
                const dohvaceneRadionice = item.radionice.filter(radionica => radionica !== imeRadionice);
                axios.patch(`http://localhost:3001/organizacije/${item.id}`,
                    {
                        radionice: dohvaceneRadionice
                    })
                    .then(res => console.log(res.data))
                    .catch(error => console.log(error.message))
            }
        })
    }

    return (
        <>
            {
                urediRadionicu &&
                <UrediRadionicu
                    idRadionice={id}
                    postaviUrediModal={postaviUrediRadionicu}
                    postaviAzurirajPrikaz={postaviAzurirajPrikaz}
                />
            }
            {
                otvorenModal &&
                <Modal
                    idKartice={id}
                    imeKartice={ime}
                    postaviOtvorenModal={postaviOtvorenModal}
                    uspjesnaPrijava={uspjesnaPrijava}
                    postaviUspjesnuPrijavu={postaviUspjesnuPrijavu}
                    azurirajBrojPrijava={postaviBrojacPrijava}
                />
            }

            <div className={style.card}>
                <div className={style.imageContainer}>
                    <img src={logo} alt="radionica-logo" className={style.cardLogo} />
                </div>
                <div className={style.cardInfoContainer}>
                    <div>
                        <h2 className={style.cardTitle}>Ime radionice: {ime}</h2>
                        <strong className={style.counter}>Broj prijava: {brojacPrijava}</strong>
                    </div>

                    <KarticaInfo info="Opis" sadrzaj={opis} />

                    <KarticaInfo info="Težina" sadrzaj={tezina} />

                    <KarticaInfo
                        info="Predavači"
                        sadrzaj={imenaPredavaca.slice(0, -1).join(", ") + (imenaPredavaca.length > 1 ? ", " : "") + imenaPredavaca.slice(-1)}
                    />


                    <KarticaInfo
                        info="Organizacije"
                        sadrzaj={imenaOrganizacija.slice(0, -1).join(", ") + (imenaOrganizacija.length > 1 ? ", " : "") + imenaOrganizacija.slice(-1)} />

                    <KarticaInfo info="Datum" sadrzaj={datum} />

                    <div className={style.buttonsContainer}>
                        <button onClick={() => postaviOtvorenModal(true)}>Prijavi se</button>
                        {
                            logiraniKorisnik === 'admin' &&
                            <>
                                <button className={style.updateBtn} onClick={() => postaviUrediRadionicu(true)}>Uredi</button>
                                <button className={style.deleteBtn} onClick={dohvatiRadionicuZaBrisanje}>Izbriši</button>
                            </>

                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Kartica;