import { ArrowLeftOnRectangleIcon, ArrowTopRightOnSquareIcon, BanknotesIcon, ChevronDownIcon, ExclamationTriangleIcon, PlusIcon, UserIcon } from "@heroicons/react/24/solid";
import { useUserStore } from "../../store/userStore";
import { Dropdown, DropdownItem } from "../Dropdown";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/appStore";
import { ReactNode } from "react";

const Sidebar = () => {
    const userState = useUserStore();
    const appState = useAppStore();
    const navigate = useNavigate();
    return (
        <aside className="w-72 h-full bg-slate-50 border-r-2 p-3">
            <p className="text-gray-400 text-sm py-1">Account</p>
            <Dropdown button={
                <article className="w-full h-10 flex justify-between items-center px-2 bg-gray-100 hover:bg-blue-200 cursor-pointer rounded-md">
                    <section className="flex">
                        <img className="rounded-full w-6 h-6" src={userState.user?.avatar_url} referrerPolicy="no-referrer" />
                        <span className="text-black font-semibold text-md ml-2">{userState.user?.username}</span>
                    </section>
                    <ChevronDownIcon className="w-6 h-6" />
                </article>

            }>
                <DropdownItem callback={() => navigate("/dashboard/profile")}><UserIcon className="w-5 h-5 mr-2" /> User Profile</DropdownItem>
                <DropdownItem callback={() => navigate("/dashboard/billing")}><BanknotesIcon className="w-5 h-5 mr-2" />  Billing</DropdownItem>
                <DropdownItem callback={() => userState.logout(navigate)}><ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" /> Logout</DropdownItem>
            </Dropdown>
            <p className="text-gray-400  text-sm py-2">Pages</p>
            <article>
                <section className="w-full h-10">
                    <SidebarButton selectIndex={0} text="Create new page" link="pages/create" endIcon={<PlusIcon className="w-6 h-6" />} />
                </section>
                <p className="text-gray-400  text-sm py-2">Customization</p>

                <section>
                    <SidebarButton selectIndex={1} text="Incidents" link="incidents" />
                </section>

                <section>
                    <SidebarButton selectIndex={2} text="Components" link="components" />
                </section>
                <section className="mb-4">
                    <SidebarButton selectIndex={3} text="Subscribers" link="subscribers" />
                </section>

            </article>

            <article className="flex flex-col">
                <hr className="w-full mb-1" />
                <span className="text-gray-400 text-sm px-1">Shortcuts</span>
                <SidebarButton onClick={() => appState.toggleHeader()} selectIndex={4} text="View your page" link="/someid/nameofthepage" endIcon={<ArrowTopRightOnSquareIcon className="w-5 h-5 " />} />
            </article>
        </aside >
    )
}

export default Sidebar;


type SidebarButtonProps = {
    text: string;
    selectIndex: number;
    onClick?: () => void;
    link?: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}
function SidebarButton({ text, link, onClick, selectIndex = 1, startIcon, endIcon }: SidebarButtonProps) {
    const appState = useAppStore();
    const navigate = useNavigate();

    return (
        <button type="button" onClick={() => { appState.selectDashboardButton(selectIndex); if (link) { navigate(link); if (onClick) onClick(); } }}
            className={`w-full h-10 flex ${appState.isDashboardButtonSelected(selectIndex) ? "bg-gray-200" : "bg-transparent"} hover:bg-blue-200 rounded-md items-center justify-between my-1 px-2`}>
            {startIcon} {text} {endIcon}
        </button>
    )
}