import style from "./Kreiraj.module.css";

function Input({ name, type, value, id, placeholder, setFunkcija }) {

    const postaviPodatke = (event) => {
        switch (id) {
            case 'ime':
                setFunkcija(prev => ({ ...prev, ime: event.target.value }))
                break;

            case 'datum':
                setFunkcija(prev => ({ ...prev, datum: event.target.value }))
                break;

            case 'slika':
                setFunkcija(prev => ({ ...prev, slikaURL: event.target.value }))
                break;

            default:
                break;
        }

    }

    return (
        <label className={style.formLabel}>
            {name}:
            <input
                type={type}
                required
                value={value}
                placeholder={placeholder}
                onChange={postaviPodatke}
            />
        </label>
    );
}

export default Input;
