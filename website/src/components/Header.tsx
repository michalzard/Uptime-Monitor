import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/authStore';
import CompanyLogo from "./CompanyLogo";
import { MenuIcon } from "../Icons";
import { useEffect } from "react";
import { useAppStore } from "../store/appStore";
import { usePageStore } from "../store/pageStore";
import { Dropdown, DropdownItem } from "./customUI/Dropdown";

function Header() {
    const navigate = useNavigate();
    const auth = useAuthStore();
    const app = useAppStore();
    const page = usePageStore();
    // perhaps could add community and docs as subdomain on its own
    const buttons = [{ name: "Pricing", redirect: "/pricing" }, { name: "Community", redirect: "/community" }, { name: "Docs", redirect: "/docs" }];
    const location = useLocation();

    useEffect(() => {
        const index = buttons.findIndex((value) => value.redirect === location.pathname);
        if (index !== -1) app.selectHeaderIndex(index);
    }, []);
    return (
        <header className="border-b-2 h-16 p-5 flex items-center justify-between z-50 bg-slate-50 sticky top-0">
            <nav onClick={() => app.selectHeaderIndex(-1)}>
                <CompanyLogo />
            </nav>
            
            <div className="lg:hidden">
                <Dropdown
                    button={
                        <MenuIcon className="w-6 h-6 " />
                    }>
                    {
                        auth.isLoggedIn ?
                            // using selected 10 so its higher number than amount of buttons in order for transition to go to right side
                            <DropdownItem callback={() => { app.selectHeaderIndex(10); navigate("/dashboard"); page.loadAll(navigate); }} className="rounded-2xl bg-blue-700 text-white font-semibold px-4 py-1">
                                Dashboard
                            </DropdownItem>
                            :
                            <>
                                <DropdownItem callback={() => { app.selectHeaderIndex(10); navigate("/signup") }} className="bg-blue-700 px-4 py-1" >
                                    <span className="text-white font-semibold">Start for free</span>
                                </DropdownItem>
                                <DropdownItem callback={() => { app.selectHeaderIndex(10); navigate("/signin") }} className="px-4 py-1">
                                    <span className="text-blue-700 font-semibold">Sign in</span>
                                </DropdownItem>
                            </>
                    }
                    {
                        buttons.map((btn, i) => {
                            return <DropdownItem key={i} callback={() => { navigate(btn.redirect); app.selectHeaderIndex(i) }} className={`text-gray-500 w-28 font-semibold px-3 
                            ${i === buttons.length - 1 ? "mr-4" : ""}`}>
                                {btn.name}
                            </DropdownItem>
                        })
                    }
                </Dropdown>
            </div>

            <nav className="hidden lg:flex justify-center items-center">
                {
                    buttons.map((btn, i) => {
                        return <section key={i}>
                            <button onClick={() => { navigate(btn.redirect); app.selectHeaderIndex(i) }} className={`text-gray-500 w-28 font-semibold px-3 ${i === buttons.length - 1 ? "mr-4" : ""}
                             transition
                            `}>{btn.name}</button>
                            <div className={`border-b-2 relative top-[20px] w-28 ${i === app.headerIndex ?
                                `border-b-blue-700 transform transition-all translate-x-0  duration-200 ease-in` :
                                `border-b-transparent transition-all transform  ${i < app.headerIndex ? "translate-x-full" : "-translate-x-full"} duration-200 ease-in`} `} />
                        </section>
                    })
                }
                {
                    auth.isLoggedIn ?
                        // using selected 10 so its higher number than amount of buttons in order for transition to go to right side
                        <button onClick={() => { app.selectHeaderIndex(10); navigate("/dashboard"); page.loadAll(navigate); }} className="rounded-2xl bg-blue-700 text-white font-semibold px-4 py-1">Dashboard</button>
                        :
                        <>
                            <button onClick={() => { app.selectHeaderIndex(10); navigate("/signup") }} className="mr-2 rounded-2xl bg-blue-700 text-white font-semibold px-4 py-1">Start for free</button>
                            <button onClick={() => { app.selectHeaderIndex(10); navigate("/signin") }} className="rounded-2xl border border-blue-700 text-blue-700 font-semibold px-4 py-1">Sign in</button>
                        </>
                }
            </nav>
        </header >
    )
}

export default Header