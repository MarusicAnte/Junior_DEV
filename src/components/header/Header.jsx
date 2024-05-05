import LogIn from "./LogIn";
import NavBar from "./Navbar";
import style from "./Header.module.css"

function Header({ sendDataToParent }) {
    return (
        <div className={style.header}>
            <NavBar />
            <LogIn sendDataToParent={sendDataToParent} />
        </div>
    );

}

export default Header;