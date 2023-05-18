import { Dialog, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react"

type DrawerProps = {
    isOpen: boolean;
    close: () => void;
}

function Drawer({ isOpen, close }: DrawerProps) {
    return (
        <Transition
            className="fixed top-0 right-0 bg-[rgba(0,0,0,0.2)] w-full h-full shadow-lg z-50"
            show={isOpen}
            appear
        >
            <Dialog as="div" className="fixed top-0 right-0 bg-white text-black w-1/2 h-full shadow-lg z-50" open={isOpen} onClose={close}>
                Dialog Window
            </Dialog>
        </Transition>
    )
}

export default Drawer