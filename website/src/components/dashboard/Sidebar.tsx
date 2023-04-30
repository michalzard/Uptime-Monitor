import { ArrowLeftOnRectangleIcon, ArrowTopRightOnSquareIcon, BanknotesIcon, ChevronDownIcon, ExclamationTriangleIcon, EyeIcon, EyeSlashIcon, GlobeAltIcon, GlobeAsiaAustraliaIcon, GlobeEuropeAfricaIcon, PlusIcon, RadioIcon, UserIcon } from "@heroicons/react/24/solid";
import { useUserStore } from "../../store/userStore";
import { Dropdown, DropdownItem } from "../Dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/appStore";
import { ReactNode, useEffect, useState } from "react";
import { Modal, ModalActions, ModalContent, ModalTitle } from "../Modal";
import { RadioGroup } from "@headlessui/react";

const Sidebar = () => {
    const userState = useUserStore();
    const appState = useAppStore();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const path = location.pathname.split("/").filter(l => { if (l !== "dashboard") { return l } else return null })[0];
        appState.selectCustomizationButtonByPath(path);
    }, [location]);

    const [newPageModalOpen, setNewPageModalOpen] = useState(false);
    const [pageType, setPageType] = useState("public");
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
            <article className="w-full h-10">
                <Modal
                    isOpen={newPageModalOpen}
                    modalClose={() => setNewPageModalOpen(false)}
                    button={<SidebarButton onClick={() => setNewPageModalOpen(true)} text="Create new page" endIcon={<PlusIcon className="w-6 h-6" />} />}
                >
                    <ModalTitle>Add new page to your account</ModalTitle>
                    <ModalContent>
                        <form>
                            <section className="flex flex-col">
                                <span className="text-sm">Page Name</span>
                                <input type="text" className="border border-blue-600 outline-blue-600 rounded py-1.5 px-2  my-1" placeholder="Page name" />
                                <span className="text-sm">Page Type</span>
                                <span className="text-xs my-1">Public pages are available to see for everyone,
                                    however private pages are only accessible to authorized users</span>
                            </section>
                            <RadioGroup value={pageType} onChange={setPageType} className="my-2 cursor-pointer">
                                <RadioGroup.Option value="public">
                                    {
                                        ({ checked }) => (<span className={`flex items-center ${checked ? "bg-green-400 text-white" : ""} 
                                        w-full p-2 rounded-md text-md font-semibold`}><GlobeEuropeAfricaIcon className="w-5 h-5 mr-1" /> Public</span>)
                                    }
                                </RadioGroup.Option>
                                <RadioGroup.Option value="private">
                                    {
                                        ({ checked }) => (<span className={`flex items-center ${checked ? "bg-green-400 text-white" : ""} 
                                        w-full p-2 rounded-md text-md font-semibold`}><EyeSlashIcon className="w-5 h-5 mr-1" />Private</span>)
                                    }
                                </RadioGroup.Option>
                            </RadioGroup>
                        </form>
                    </ModalContent>
                    <ModalActions>
                        <button onClick={() => setNewPageModalOpen(false)} className="px-4 py-1.5 text-sm text-blue-700  font-semibold rounded">Cancel</button>
                        <button onClick={() => { setNewPageModalOpen(false) }} className="bg-blue-700 px-4 py-1.5 text-sm text-white font-semibold rounded">Add page</button>
                    </ModalActions>
                </Modal>
            </article>

            <p className="text-gray-400  text-sm py-2">Customization</p>
            <article>
                {
                    appState.customizationButtons.map(btn => (
                        <section key={btn.desiredIndex}>
                            <SidebarButton selectIndex={btn.desiredIndex} text={btn.text} link={btn.text} />
                        </section>
                    ))
                }
            </article>

            <article className="flex flex-col">
                <hr className="w-full mb-1" />
                <span className="text-gray-400 text-sm px-1">Shortcuts</span>
                <SidebarButton selectIndex={4} text="View your page" link="/someid/nameofthepage" endIcon={<ArrowTopRightOnSquareIcon className="w-5 h-5 " />} />
            </article>
        </aside >
    )
}

export default Sidebar;


type SidebarButtonProps = {
    text: string;
    selectIndex?: number;
    onClick?: () => void;
    link?: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}
function SidebarButton({ text, link, onClick, selectIndex = -10, startIcon, endIcon }: SidebarButtonProps) {
    const appState = useAppStore();
    const navigate = useNavigate();

    return (
        <button type="button" onClick={() => {
            if (selectIndex >= 0) appState.selectCustomizationButton(selectIndex);
            if (link) navigate(link.toLowerCase());
            if (onClick) onClick();
        }}
            className={`w-full h-10 flex ${appState.isCustomizationButtonActive(selectIndex) ? "bg-gray-200" : "bg-transparent"} hover:bg-blue-200 rounded-md items-center justify-between my-1 px-2`}>
            {startIcon} {text} {endIcon}
        </button>
    )
}