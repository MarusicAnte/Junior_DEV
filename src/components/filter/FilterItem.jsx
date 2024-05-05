import style from "./Filter.module.css"

function FilterItem({ ime, kategorija, filtrirajOpcije }) {

    const handleInputChange = (event) => {
        if (event.target.checked) {
            filtrirajOpcije(prev => {
                if (kategorija === "teme") {
                    return { ...prev, odabraneTeme: [...prev.odabraneTeme, event.target.value] }
                } else if (kategorija === "tezine") {
                    return { ...prev, odabraneTezine: [...prev.odabraneTezine, event.target.value] }
                } else {
                    return { ...prev, odabraneOrganizacije: [...prev.odabraneOrganizacije, event.target.value] }
                }
            });
        } else {
            filtrirajOpcije(prev => {
                if (kategorija === "teme") {
                    return { ...prev, odabraneTeme: [...prev.odabraneTeme].filter(x => x !== event.target.value) }
                } else if (kategorija === "tezine") {
                    return { ...prev, odabraneTezine: [...prev.odabraneTezine].filter(x => x !== event.target.value) }
                } else {
                    return { ...prev, odabraneOrganizacije: [...prev.odabraneOrganizacije].filter(x => x !== event.target.value) }
                }
            })
        }
    }

    return (
        <label className={style.filterLabel}>
            <input type="checkbox" value={ime} onChange={handleInputChange} />
            {ime}
        </label>
    );
}

export default FilterItem;
