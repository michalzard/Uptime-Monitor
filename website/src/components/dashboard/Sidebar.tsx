import { ArrowLeftOnRectangleIcon, ArrowTopRightOnSquareIcon, BanknotesIcon, ChevronDownIcon, UserIcon } from "@heroicons/react/24/solid";
import { useAuthStore } from "../../store/authStore";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppStore } from "../../store/appStore";
import { ReactNode, useEffect, useState } from "react";
import { Dropdown, DropdownItem } from "../customUI/Dropdown";
import { usePageStore } from "../../store/pageStore";
import PageDropdown from "./Page/PageDropdown";
import { LoadingSpinner } from "../../Icons";
import NewPageModal from "./Page/NewPageModal";


type SidebarButtonProps = {
    text: string;
    selectIndex?: number;
    onClick?: () => void;
    link?: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    hidden?: boolean;
}

const Sidebar = () => {
    const auth = useAuthStore();
    const app = useAppStore();
    const page = usePageStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [newPageModalOpen, setNewPageModalOpen] = useState(false);
    useEffect(() => {
        page.loadAll(navigate);
    }, []);

    useEffect(() => {
        const path = location.pathname.split("/").filter(l => { if (l !== "dashboard") { return l } else return null })[0];
        app.selectCustomizationButtonByPath(path);
    }, [location]);

    if (!auth.isLoading && !auth.isLoggedIn) return <Navigate to="/" />
    return (
        <aside className="w-72 h-full bg-slate-50 border-r-2 p-3">
            <p className="text-gray-400 text-sm py-1">Account</p>
            <Dropdown button={
                <article className="w-full h-10 flex justify-between items-center px-2 bg-gray-100 hover:bg-blue-200 cursor-pointer rounded-md">
                    <section className="flex">
                        <img className="rounded-full w-6 h-6" src={auth.user?.avatar_url} referrerPolicy="no-referrer" />
                        <span className="text-black font-semibold text-md ml-2">{auth.user?.username}</span>
                    </section>
                    <ChevronDownIcon className="w-6 h-6" />
                </article>

            }>
                <DropdownItem callback={() => navigate("/dashboard/user/profile")}><UserIcon className="w-5 h-5 mr-2" /> User Profile</DropdownItem>
                <DropdownItem callback={() => navigate("/dashboard/user/billing")}><BanknotesIcon className="w-5 h-5 mr-2" />  Billing</DropdownItem>
                <DropdownItem callback={() => auth.logout(navigate)}><ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" /> Logout</DropdownItem>
            </Dropdown>
            <p className="text-gray-400  text-sm py-2">Pages</p>
            <article className="w-full h-10">
                {
                    page.isLoading ? <LoadingSpinner className="w-2 h-2 overflow-visible text-blue-600" /> :
                        page.pages.length > 0 ? <PageDropdown /> :
                            <NewPageModal isOpen={newPageModalOpen} open={() => setNewPageModalOpen(true)} close={() => setNewPageModalOpen(false)} />
                }
            </article>
            {
                page.pages.length > 0 ?
                    <>
                        <p className="text-gray-400  text-sm py-2">Customization</p>
                        <article>
                            {
                                app.customizationButtons.map(btn => (
                                    <section key={btn.desiredIndex}>
                                        <SidebarButton selectIndex={btn.desiredIndex} text={btn.text} link={`${page.currentPage?.id}/${btn.text}`} />
                                    </section>
                                ))
                            }
                        </article>

                        <article className="flex flex-col">
                            <hr className="w-full mb-1" />
                            <span className="text-gray-400 text-sm px-1">Shortcuts</span>
                            <SidebarButton selectIndex={4} text="View your page"
                                onClick={() => { window.location.href = `${import.meta.env.VITE_CLIENT_URL}/page/${page.currentPage?.id}` }}
                                endIcon={<ArrowTopRightOnSquareIcon className="w-5 h-5 " />} />
                        </article>
                    </>
                    : null
            }
        </aside >
    )
}

export default Sidebar;

export function SidebarButton({ text, link, onClick, selectIndex = -10, startIcon, endIcon, hidden = false }: SidebarButtonProps) {
    const app = useAppStore();
    const navigate = useNavigate();

    return (
        <button type="button" onClick={(e) => {
            if (selectIndex >= 0) { app.selectCustomizationButton(selectIndex); }
            if (link) { navigate(link?.toLowerCase()); }
            if (onClick) { onClick(); }
        }}
            className={`${hidden ? "hidden" : "visible"} w-full h-10 flex ${app.isCustomizationButtonActive(selectIndex) ? "bg-gray-200" : "bg-transparent"} hover:bg-blue-200 rounded-md items-center justify-between my-1 px-2`}>
            {startIcon} {text} {endIcon}
        </button>
    )
}