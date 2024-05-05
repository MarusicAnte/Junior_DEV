import { useState } from "react";
import style from "./Forma.module.css"

function FormaInput({ name, placeholder, type, kategorija, value, postaviFormu, validniPodatak, postaviValidnePodatke }) {

    const validacijaUnosa = (event) => {
        if (kategorija === 'ime') {
            postaviFormu(prev => ({ ...prev, imePrezime: event.target.value }))

            const ispravnoIme = /^[a-zA-ZčćžšđČĆŽŠĐ]+(?:\s[a-zA-ZčćžšđČĆŽŠĐ]+)?$/.test(event.target.value);
            postaviValidnePodatke(prev => ({ ...prev, validnoImePrezime: ispravnoIme }));

        } else if (kategorija === 'email') {
            postaviFormu(prev => ({ ...prev, email: event.target.value }));

            const ispravniEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value);
            postaviValidnePodatke(prev => ({ ...prev, validniEmail: ispravniEmail }));
        } else {
            postaviFormu(prev => ({ ...prev, imeKartice: event.target.value }));

            const ispravniTekst = /^[a-zA-ZčćžšđČĆŽŠĐ0-9\s.,?!()-\[\]{}]+$/u.test(event.target.value);
            postaviValidnePodatke(prev => ({ ...prev, imeKartice: ispravniTekst }));
        }
    }

    return (
        <label className={style.formLabel}>
            {name}:
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                required
                minLength={6}
                maxLength={30}
                className={style.formInput}
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

export default FormaInput;