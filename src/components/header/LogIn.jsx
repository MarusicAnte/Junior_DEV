import style from "./Header.module.css";
import { useState, useEffect } from "react";


function LogIn({ sendDataToParent }) {
    const [user, setUser] = useState('korisnik');

    const switchUser = (event) => {
        setUser(event.target.checked ? 'admin' : 'korisnik');
    }

    useEffect(() => {
        sendDataToParent(user);
    }, [user]);

    return (
        <>
            <div className={style.container}>
                <span className={style.user}>{user}</span>
                <input type="checkbox" id="check" onChange={switchUser} className={style.checkboxInput} />
                <label htmlFor="check" className={style.button}></label>
            </div>
        </>
    );
}

export default LogIn;
