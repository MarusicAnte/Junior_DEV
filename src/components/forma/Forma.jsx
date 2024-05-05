import style from "./Forma.module.css"
import FormaInput from "./FormaInput";
import TextArea from "./TextArea";
import axios from "axios";

function Forma({ formaPodaci, postaviPodatkeForme, validniPodaci, postaviValidnePodatke,
    postaviUspjesnuPrijavu, azurirajBrojPrijava }) {

    const napraviPrijavu = () => {
        if (validniPodaci.validnoImePrezime && validniPodaci.validniEmail
            && validniPodaci.validniRazlogPrijave) {
            alert("Uspjesna prijava !");

            axios.post("http://localhost:3001/prijave", formaPodaci)
                .then(res => console.log(res.data))
                .catch(error => console.log(error.message));

            postaviUspjesnuPrijavu(true);
            azurirajBrojPrijava(prev => prev + 1);
        } else {
            alert("Forma nije ispravno popunjena !");
            postaviUspjesnuPrijavu(false);
        }
    }

    return (
        <>
            <form className={style.form}>
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
            </form>
            <button className={style.formButton} onClick={napraviPrijavu}>PRIJAVI SE</button>
        </>
    );
}

export default Forma;