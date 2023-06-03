import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ComponentsPage() {
    const navigate = useNavigate();
    const activeTabClass = "border-b-2 border-blue-700 translate-y-0.5";
    return (
        <article className="w-full lg:w-[calc(100vw-300px)] h-full flex flex-col items-center lg:justify-center px-2">
            <section className="flex flex-col w-full lg:w-1/2">
                <span className="text-center lg:text-left text-3xl font-semibold my-5">Components</span>
                <nav className="[&>span]:p-2.5 [&>span]:cursor-pointer text-gray-700 font-semibold border-b-2 flex items-center justify-between">
                    <span className={activeTabClass}>Active</span>
                    <button onClick={() => navigate("new")} className={"bg-blue-700 px-3 py-1.5 rounded-[4px] text-sm text-white font-semibold"}>Add Component</button>
                </nav>
            </section>
            <section className="flex flex-col items-center">
                <img src={"/dashboard/components/no_components.png"} className="h-80 lg:h-96 w-96" alt="No Components" />
                <span className="text-xl font-semibold text-center mb-2">No Components</span>
                <span className="text-sm text-center ">Components are functioning pieces of your page that display status of either your website or application.</span>
            </section>
            <button onClick={() => navigate("new")} className="bg-blue-700 px-4 py-1.5 rounded-md font-semibold text-white my-3">Add a component</button>
            <div className="mb-10" />
        </article>
    )
}

export default ComponentsPage 