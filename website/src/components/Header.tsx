import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from '../store/userStore';
import CompanyLogo from "./CompanyLogo";
import { MenuIcon } from "../Icons";
import { useEffect, useState } from "react";


function Header() {
    const navigate = useNavigate();
    const user = useUserStore();
    // perhaps could add community and docs as subdomain on its own
    const buttons = [{ name: "Pricing", redirect: "/pricing" }, { name: "Community", redirect: "/community" }, { name: "Docs", redirect: "/docs" }];
    const [selected, setSelected] = useState(-1);
    const location = useLocation();

    useEffect(() => {
        const index = buttons.findIndex((value) => value.redirect === location.pathname);
        if (index !== -1) setSelected(index);

    }, []);
    return (
        <header className="border-b-2 h-16 p-5 md:px-10 flex items-center bg-white justify-between z-50 sticky top-0 ">
            <nav onClick={() => setSelected(-1)}>
                <CompanyLogo />
            </nav>
            <MenuIcon className="w-6 h-6 md:hidden" />

            <nav className="hidden md:flex justify-center items-center">
                {
                    buttons.map((btn, i) => {
                        return <section key={i}>
                            <button onClick={() => { navigate(btn.redirect); setSelected(i) }} className={`text-gray-500 w-28 font-semibold px-3 ${i === buttons.length - 1 ? "mr-4" : ""}
                             transition
                            `}>{btn.name}</button>
                            <div className={`border-b-2 relative top-[20px] w-28 ${i === selected ?
                                `border-b-blue-700 transform transition-all translate-x-0  duration-200 ease-in` :
                                `border-b-transparent transition-all transform  ${i < selected ? "translate-x-full" : "-translate-x-full"} duration-200 ease-in`} `} />
                        </section>
                    })
                }


                {
                    user.isLoggedIn ?
                        // using selected 10 so its higher number than amount of buttons in order for transition to go to right side
                        <button onClick={() => { setSelected(10); navigate("/dashboard") }} className="rounded-2xl bg-blue-700 text-white font-semibold px-4 py-1">Dashboard</button>
                        :
                        <>
                            <button onClick={() => { setSelected(10); navigate("/signup") }} className="mr-2 rounded-2xl bg-blue-700 text-white font-semibold px-4 py-1">Start for free</button>
                            <button onClick={() => { setSelected(10); navigate("/signin") }} className="rounded-2xl border border-blue-700 text-blue-700 font-semibold px-4 py-1">Sign in</button>
                        </>
                }
            </nav >
        </header >
    )
}

export default Header