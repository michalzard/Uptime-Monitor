import { ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

type DropdownProps = {
    button: ReactNode | ReactNode[];
    children: ReactNode | ReactNode[];
}

export function Dropdown({ button, children }: DropdownProps) {
    return (
        <Menu as="div" className="flex items-center justify-center">
            <Menu.Button className="w-full h-full">
                {button}
            </Menu.Button>
            <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {
                        children
                    }

                </Menu.Items>
            </Transition>
        </Menu >
    )
}
// <div className={`top-[${anchorPosition?.top}px] left-[${orientation === "left" ? "-" : ""}${anchorPosition?.left}px]  ${open ? "visible" : "hidden"} absolute z-50 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus: outline-none`} tabIndex={-1}>
//     <div className="py-1">
//         {children}
//     </div>
// </div >

type DropdownItemProps = {
    callback?: () => void;
    children: ReactNode | ReactNode[];
}
export function DropdownItem({ callback, children }: DropdownItemProps) {
    return (
        <div className="p-0.5">
            <Menu.Item>
                {({ active }) => (
                    <button
                        className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                        onClick={() => { callback ? callback() : null }}
                    >
                        {children}
                    </button>
                )}
            </Menu.Item>
        </div>
    )
}