import style from "./Administracija.module.css"
import AdminHeader from "../../components/adminHeader/AdminHeader"

function Administracija() {
    return (
        <div className={style.adminPage}>
            <AdminHeader />
        </div>
    );
}

export default Administracija;