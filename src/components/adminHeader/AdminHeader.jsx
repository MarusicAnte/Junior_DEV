import { NavLink } from "react-router-dom";
import style from "../../pages/administracija/Administracija.module.css"

function AdminHeader() {

    const navLinkStyles = ({ isActive }) => {
        return {
            backgroundColor: isActive ? '#009ed1' : 'white',
            color: isActive ? 'white' : 'black',
            fontWeight: isActive ? 'bold' : 'normal'
        }
    }

    return (
        <div className={style.administrationNavBar}>
            <NavLink to="/administracija/radionice" style={navLinkStyles}>Radionice</NavLink>
            <NavLink to="/administracija/predavaci" style={navLinkStyles}>Predavači</NavLink>
            <NavLink to="/administracija/organizacije" style={navLinkStyles}>Organizacije</NavLink>
            <NavLink to="/administracija/prijave" style={navLinkStyles}>Prijave</NavLink>
        </div>
    );
}

export default AdminHeader;