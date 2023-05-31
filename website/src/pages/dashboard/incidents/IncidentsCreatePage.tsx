import { InformationCircleIcon } from "@heroicons/react/24/solid";
import Stepper from "../../../components/customUI/Stepper";
import { usePageStore } from "../../../store/pageStore";

function IncidentsCreatePage() {
    const { currentPage } = usePageStore();
    const inputClass = `focus:outline-blue-500 disabled:text-gray-400 border-gray-300 bg-gray-50 placeholder:text-gray-700 px-3 py-1.5 rounded-sm ring-1 ring-black/10`;
    const smallLabelclass = `text-left text-gray-400 text-xs my-2`;
    // TODO: actually handle form inputs
    return (
        <article className="w-full lg:w-[calc(100vw-300px)] h-full flex flex-col items-center justify-center">
            <section className="flex flex-col w-full lg:w-1/2 px-4">
                <span className="text-left text-black text-2xl font-semibold mb-2">Create Incident</span>
                <input className={inputClass} placeholder="Incident Name"></input>
                <label className={smallLabelclass}>This incident will be posted to {currentPage?.name}</label>
                <div className="flex items-center">
                    {/* TODO: change styling on checkbox */}
                    <input type="checkbox" />
                    <span className="ml-2 text-sm text-black">Check if incident happened in the past</span>
                </div>

                <label className={smallLabelclass}>Incident Status</label>
                <div className="flex flex-col outline outline-2 outline-gray-300 rounded-sm p-8">
                    <Stepper steps={["Investigating", "Identified", "Monitoring", "Resolved"]} />
                </div>

                <label className={smallLabelclass}>Message</label>
                <textarea className="w-full mb-8 outline outline-2 rounded-sm outline-gray-300 bg-gray-100 h-28 p-2 placeholder:text-gray-500 placeholder:text-sm focus:outline-blue-500" placeholder="We are currently investigating this issue." />

                <label className={smallLabelclass}>Components Affected <span className="text-blue-500 font-semibold tracking-tight cursor-pointer">(Select All)</span></label>
                <section className="h-44 overflow-y-auto">
                    <hr />
                    {
                        // TODO: add buttons that will display severity of incident (Operational,Degraded performance,partial outage,Major outage,Under maintenance)
                        ["API", "Management Portal", "Component 1", "Component 2"].map(comp =>
                            <div key={comp} className="flex px-1 py-2">
                                <input type="checkbox" className="mr-2 cursor-pointer" />
                                {comp}
                            </div>
                        )
                    }
                </section>
                <hr />
                <label className={smallLabelclass}>Notifications</label>

                <section>
                    {/*TODO: if component not selected,disable */}
                    <input type="checkbox" className="mr-2 cursor-pointer" />
                    <span className="text-gray-600">Send Notifications</span>
                    <div className="flex items-center text-gray-600">
                        <InformationCircleIcon className="w-6 h-6 " />
                        <label className="text-xs ml-1 my-3">You need to select atleast 1 affected component to enable notifications.</label>
                    </div>
                </section>
                {/* create button */}
                <section className="flex justify-end">
                    <button className="bg-blue-700 px-5 py-1.5 rounded-md font-semibold text-white">Create</button>
                </section>

            </section>
        </article>
    )
}

export default IncidentsCreatePage