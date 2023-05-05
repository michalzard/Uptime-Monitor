import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode, useState } from 'react'

type DialogProps = {
    isOpen: boolean;
    modalClose: () => void;
    button: ReactNode;
    children: ReactNode | ReactNode[];
}

export function Modal({ children, button, isOpen, modalClose }: DialogProps) {
    return (
        <>
            <div>
                {
                    button
                }

            </div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={modalClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-6 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    {children}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </>
    )
}

type ModalChildrenProps = {
    children: ReactNode | ReactNode[];
}
export type ModalTitleProps = ModalChildrenProps;
export type ModalContentProps = ModalChildrenProps;
type ModalActionsOrientation = {
    orientation?: "left" | "right";
}
export type ModalActionsProps = ModalChildrenProps & ModalActionsOrientation;
// h3 
export function ModalTitle({ children }: ModalTitleProps) {
    return (
        <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900 mb-2"
        >
            {children}
        </Dialog.Title>
    )
}
// text
export function ModalContent({ children }: ModalContentProps) {
    return (
        <div className='flex flex-col text-gray-500'>{children}</div>
    )
}
// action buttons
export function ModalActions({ children, orientation = "right" }: ModalActionsProps) {
    return (<div className={`w-full flex ${orientation === "right" ? "justify-end" : "justify-start"} items-center`}>{children}</div>)
}