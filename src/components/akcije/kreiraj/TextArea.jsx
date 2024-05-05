import style from "./Kreiraj.module.css";

function TextArea({ name, id, setFunkcija, value }) {

    const postaviPodatke = (event) => {

        id === "opis" ? setFunkcija(prev => ({ ...prev, opis: event.target.value }))
            :
            setFunkcija(prev => ({ ...prev, biografija: event.target.value }))
    }

    return (
        <label className={style.formLabel}>
            {name}:
            <textarea required onChange={postaviPodatke} value={value} />
        </label>
    );
}

export default TextArea;