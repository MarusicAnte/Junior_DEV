import style from "./Forma.module.css"

function TextArea({ name, placeholder, value, postaviFormu, validniPodatak, postaviValidnePodatke }) {

    const validacijaUnosa = (event) => {
        postaviFormu(prev => ({ ...prev, razlogPrijave: event.target.value }));

        const ispravniTekst = /^[a-zA-ZčćžšđČĆŽŠĐ0-9\s.,?!()-\[\]{}]+$/u.test(event.target.value);
        postaviValidnePodatke(prev => ({ ...prev, validniRazlogPrijave: ispravniTekst }));
    }

    return (
        <label className={style.formLabel}>
            {name}:
            <textarea
                placeholder={placeholder}
                value={value}
                required
                className={style.textarea}
                onChange={validacijaUnosa}
                style={value !== "" ? (validniPodatak ? ({ 'border': '2px solid #00d800' }) : ({ 'border': '2px solid red' })) : ({ 'border': '2px solid red' })}
            />
            {
                value !== "" ? (
                    validniPodatak ? <p className={style.validMessage}>Točan unos</p>
                        :
                        <p className={style.invalidMessage}>Krivi unos</p>
                ) : <p className={style.invalidMessage}>Prazno</p>
            }
        </label>
    );
}

export default TextArea;