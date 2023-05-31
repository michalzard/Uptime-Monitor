import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/solid";
import { usePageStore } from "../../../store/pageStore";
import { Dropdown, DropdownItem } from "../../customUI/Dropdown";
import { useState } from "react";
import NewPageModal from "./NewPageModal";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../store/appStore";

function PageDropdown({ closeDrawer }: { closeDrawer?: () => void }) {
    const page = usePageStore();
    const app = useAppStore();
    const [openNewPageModal, setOpenNewPageModal] = useState(false);
    const navigate = useNavigate();
    return (
        <>
            <Dropdown
                button={
                    <span className="flex w-full items-center justify-between bg-gray-100 hover:bg-blue-200 text-gray-900 font-semibold rounded-md p-2 text-base">
                        {page.currentPage?.name || ""}
                        <ChevronDownIcon className="w-6 h-6" />
                    </span>
                }
            >
                {
                    page.pages.map(p => <DropdownItem key={p.id} callback={() => {
                        navigate(`/dashboard/${p.id}/incidents`); page.selectCurrentPage(p);
                        app.selectCustomizationButton(0);
                        if (closeDrawer) closeDrawer();
                    }}>
                        {p.name}
                    </DropdownItem>)
                }
                <DropdownItem className="justify-between" callback={() => { setOpenNewPageModal(true); }}>
                    Create new page <PlusIcon className="w-5 h-5 " />
                </DropdownItem>
            </Dropdown>
            <NewPageModal open={() => setOpenNewPageModal(true)} hidden={true} isOpen={openNewPageModal} close={() => setOpenNewPageModal(false)} />
        </>
    )
}

export default PageDropdown;