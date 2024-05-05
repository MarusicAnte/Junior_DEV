import { NavLink } from "react-router-dom";
import style from "./Header.module.css"
import { useContext } from "react";
import UserContext from "../../kontekst";

function NavBar() {

    const logiraniKorisnik = useContext(UserContext);

    const navLinkStyles = ({ isActive }) => {
        return {
            backgroundColor: isActive ? '#009ed1' : 'white',
            color: isActive ? 'white' : 'black',
            fontWeight: isActive ? 'bold' : 'normal'
        }
    }

    return (
        <nav className={style.navBar}>
            <NavLink to="/" style={navLinkStyles}>Radionice</NavLink>
            <NavLink to="/predavaci" style={navLinkStyles}>Predavači</NavLink>
            {
                logiraniKorisnik === 'admin' ? (<NavLink to="/administracija" style={navLinkStyles}>Administracija</NavLink>)
                    : null
            }

        </nav>
    );
}

export default NavBar;