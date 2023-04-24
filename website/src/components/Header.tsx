import { useNavigate } from "react-router-dom";
import { useUserStore } from '../store/userStore';

function Header() {
    const navigate = useNavigate();
    const user = useUserStore();

    return (
        <header className="">
            Header
        </header >
    )
}

export default Header