import Forma from "../forma/Forma";
import UspjesnaPrijava from "../forma/UspjesnaPrijava";
import style from "./Modal.module.css"
import { useState } from "react";


function Modal({ idKartice, imeKartice, postaviOtvorenModal, uspjesnaPrijava, postaviUspjesnuPrijavu, azurirajBrojPrijava }) {

    const [forma, postaviFormu] = useState({
        idKartice: idKartice,
        imeKartice: imeKartice,
        imePrezime: "",
        email: "",
        razlogPrijave: ""
    })

    const [validniPodaci, postaviValidnePodatke] = useState({
        validnoImePrezime: false,
        validniEmail: false,
        validniRazlogPrijave: false
    })

    return (
        <div className={style.modalBackground}>
            <div className={style.modalContainer}>
                {
                    !uspjesnaPrijava && <button className={style.closeModalBtn} onClick={() => postaviOtvorenModal(false)}>X</button>
                }
                {
                    uspjesnaPrijava ?
                        <UspjesnaPrijava
                            imePrezime={forma.imePrezime}
                            email={forma.email}
                            razlogPrijave={forma.razlogPrijave}
                            akcija={postaviOtvorenModal}
                            postaviUspjesnuPrijavu={postaviUspjesnuPrijavu}
                        />
                        :
                        <div className={style.formContainer}>
                            <h2 className={style.modalTitle}>Prijavi se na radionicu !</h2>
                            <Forma
                                idKartice={idKartice}
                                imeKartice={imeKartice}
                                formaPodaci={forma}
                                postaviPodatkeForme={postaviFormu}
                                validniPodaci={validniPodaci}
                                postaviValidnePodatke={postaviValidnePodatke}
                                postaviUspjesnuPrijavu={postaviUspjesnuPrijavu}
                                azurirajBrojPrijava={azurirajBrojPrijava}
                            />
                        </div>
                }

            </div>
        </div>
    );
}

export default Modal;