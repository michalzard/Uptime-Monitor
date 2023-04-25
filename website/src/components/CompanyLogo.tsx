import { useNavigate } from "react-router-dom";
function CompanyLogo() {
    const navigate = useNavigate();
    // returns on landing 
    return (
        <div className="flex items-center justify-center cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.png" className="w-12 h-8 flex mr-2" />
            <span className="text-blue-700 text-xl md:text-2xl font-bold tracking-widest">SENTINEL</span>
        </div>
    )
}

export default CompanyLogo;