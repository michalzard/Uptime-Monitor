import { useState } from "react"
import { useNavigate } from "react-router-dom";

function IncidentsPage() {

  // TODO: make screen when there's no incidents left and show menu 
  // TODO: make  menu screen for Open(currently active),Incidents(all),Maintanances (filtered incidents),Templates(templates will auto fill all fields)
  // TODO: Prompt user to create component first if he doesnt have any
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const isTabActive = (tabIndex: number) => {
    return `${activeTab === tabIndex ? "border-b-2 border-blue-700" : ""}`;
  }
  return (
    <article className="w-full lg:w-[calc(100vw-300px)] h-full flex flex-col items-center justify-center p-2">
      <section className="flex flex-col w-full lg:w-1/2  pt-20 lg:pt-0">
        <span className="text-center lg:text-left text-3xl font-semibold my-5">Incidents</span>
        <nav className="[&>span]:p-2.5 [&>span]:cursor-pointer py-2 text-gray-700 font-semibold border-b-2">
          <span className={isTabActive(1)} onClick={() => { setActiveTab(1) }}>Open</span>
          <span className={isTabActive(2)} onClick={() => { setActiveTab(2); navigate("incidents") }}>Incidents</span>
          <span className={isTabActive(3)} onClick={() => { setActiveTab(3); navigate("maintenance") }}>Maintenances</span>
        </nav>
      </section>
      <section className="flex flex-col my-2">
        <img src={"/dashboard/incidents/no_incidents.png"} className="h-96" alt="No Incidents" />
        <span className="text-xl font-semibold text-center my-3">No Open Incidents</span>
        <span className="text-sm text-center my-2">New incidents and scheduled maintanance events will appear here.</span>
      </section>
      <button onClick={() => navigate("create")} className="bg-blue-700 px-4 py-1.5 rounded-md font-semibold text-white my-3">Create Incident</button>

    </article >
  )
}

export default IncidentsPage