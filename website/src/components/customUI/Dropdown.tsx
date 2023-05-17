import { ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";

type DropdownProps = {
    button: ReactNode | ReactNode[];
    children: ReactNode | ReactNode[];
}

type DropdownItemProps = {
    callback?: () => void;
    className?: string;
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
                <Menu.Items className="overflow-y-auto max-h-[450px] absolute right-0 mt-2 w-56 lg:w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {
                        children
                    }
                </Menu.Items>
            </Transition>
        </Menu >
    )
}

export function DropdownItem({ callback, children, className }: DropdownItemProps) {
    return (
        <div className="p-0.5">
            <Menu.Item>
                {({ active }) => (
                    <button
                        className={`flex w-full items-center  rounded-md px-2 py-2.5 text-sm  ${active ? 'bg-blue-500 text-white' : 'text-gray-900'} truncate `.concat(className as string)}
                        onClick={() => { callback ? callback() : null }}
                    >
                        {children}
                    </button>
                )}
            </Menu.Item>
        </div>
    )
}