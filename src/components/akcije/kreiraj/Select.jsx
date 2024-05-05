import style from "./Kreiraj.module.css"

function Select({ name, selectId, options, radionica, postaviRadionicu }) {

    const postaviPodatke = (event) => {
        const novaRadionica = { ...radionica };

        switch (selectId) {
            case 'teme':
                novaRadionica.tema = event.target.value;
                postaviRadionicu(novaRadionica)
                break;

            case 'tezine':
                novaRadionica.tezina = event.target.value;
                postaviRadionicu(novaRadionica)
                break;

            case 'organizacije':
                novaRadionica.organizacije = event.target.value;
                postaviRadionicu(prev => ({ ...prev, organizacije: [...prev.organizacije, event.target.value] }));
                break;

            default:
                novaRadionica.predavac = event.target.value;
                postaviRadionicu(prev => ({ ...prev, predavac: [...prev.predavac, event.target.value] }));
                break;
        }
    }

    return (
        <label className={style.formLabel}>
            {name}:
            <select onChange={postaviPodatke} required multiple>
                <option>- - Odaberi</option>
                {options.map(option => (
                    <option key={option.id} value={option.ime}>{option.ime}</option>
                ))}
            </select>
        </label>
    );
}

export default Select;