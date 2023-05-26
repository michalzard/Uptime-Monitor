import { Transition } from "@headlessui/react"
import { ReactNode, useEffect, useRef, useState } from "react";
import ClickAwayListener from "react-click-away-listener";

type DrawerProps = {
    isOpen: boolean;
    children?: ReactNode | ReactNode[];
    close: () => void;
}

function Drawer({ isOpen, close, children }: DrawerProps) {
    return (
        <Transition
            show={isOpen}
            enter="z-50 transition-all duration-200 ease-in"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="z-50 transition-all duration-200 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className={`fixed top-0 left-0 z-50 w-full h-full bg-[rgba(0,0,0,.4)] `} >
                <Transition.Child
                    enter="transition-all duration-300 ease-in"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition-all duration-300 ease-in"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"

                >
                    <div className="fixed top-0 left-0 flex w-full">
                        <ClickAwayListener onClickAway={close}>
                            <aside className="w-4/5 lg:w-screen max-w-md h-screen bg-white ">
                                {children}
                            </aside>
                        </ClickAwayListener>
                    </div>
                </Transition.Child>
            </div>
        </Transition>
    )
}

export default Drawer;


type SwipeableDrawerProps = {
    open: () => void;
    swipeableArea?: number;
} & DrawerProps;

export function SwipeableDrawer({ isOpen, open, close, swipeableArea = 40, children }: SwipeableDrawerProps) {
    // have like 40px wide point from which we will start detecting swipes
    const swipeableAreaRef = useRef<HTMLDivElement>(null);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);
    const [swiping, setSwiping] = useState(false);

    const handleSwipe = () => {
        // on right swipe open
        if (touchEndX > touchStartX && swiping && !isOpen) {
            open();
            setSwiping(false);
        }
    }

    useEffect(() => {
        // touch start will be only detectable from within "hitbox"
        if (swipeableAreaRef.current) {
            swipeableAreaRef.current.addEventListener("touchstart", e => {
                setTouchStartX(e.changedTouches[0].clientX);
                setSwiping(true);
            })
        }
        return () => document.removeEventListener("touchstart", handleSwipe);
    }, [swipeableAreaRef]);

    useEffect(() => {
        document.addEventListener("touchend", e => {
            setTouchEndX(e.changedTouches[0].clientX);

        });
        // cleanup
        return () => document.removeEventListener("touchend", handleSwipe);

    }, []);

    useEffect(() => {
        handleSwipe(); //on every touch change check if swipe was gestured
    }, [touchStartX, touchEndX]);

    return (
        <>
            <div ref={swipeableAreaRef} style={{ width: `${swipeableArea}px` }} className={`fixed z-50 top-0 left-0 h-screen ${isOpen ? "hidden" : "visible"} lg:hidden`} />
            <Drawer isOpen={isOpen} close={() => { close(); }}>
                {children}
            </Drawer>
        </>
    )
}