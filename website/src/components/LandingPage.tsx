import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpIcon } from "@heroicons/react/24/solid";

function LandingPage() {
  const navigate = useNavigate();
  const [atBottom, setAtBottom] = useState(false);
  const rootElement = document.querySelector("#root");

  useEffect(() => {
    if (rootElement)
      rootElement?.addEventListener("scroll", () => {
        setAtBottom(rootElement.scrollHeight - rootElement.scrollTop === rootElement.clientHeight);
      })
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50 p-10">

      <section className="flex flex-col items-center">
        <span className="text-black text-3xl font-bold">Build trust with your customers</span>
        <span className="text-gray-500 text-xl font-semibold">Easily communicate real-time status to your customers.</span>
        <button className="bg-blue-700 text-white font-medium rounded-md py-2 px-4 mt-3" onClick={() => navigate("/signup")}>Try now for free</button>
      </section>

      <FeatureArcticle header="System status pages" title="Build trust when incidents happen" description="Quickly and professionally communicate downtime and outages with your audience
            from comfort of the same tool you monitor your website performance with." imgSrc="/landing/status.jpeg" />

      <FeatureArcticle orientation="right" header="Support Teams" title="Eliminate high amount of support tickets & janky email lists"
        description="Halt the flood of support request during an incident with proactive communication." imgSrc="/landing/support.jpeg" />

      <FeatureArcticle header="Website reporting and analytics" title="Display status of each part of your service" description="Customize and control which
            component you show on your status page to display critical data about your service uptime using components on your status page." imgSrc="/landing/monitoring.jpeg" />

      <FeatureArcticle orientation="right" header="Real user monitoring " title="Monitor user experice" description="Use real data from previous sessions to improve quality of visitor's experience.
      Benchmark page speed,bounce rates and overall satisfaction to optimize user experience." imgSrc="/landing/userexp.jpeg" />
      {
        atBottom ?
          <div onClick={() => rootElement?.scrollTo({ top: 0, behavior: "smooth" })} className="fixed cursor-pointer flex items-center justify-center
          text-white bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 rounded-full bg-blue-600">
            <ArrowUpIcon className="w-6" />
          </div>
          : null
      }

    </div>
  )
}

export default LandingPage;

type LandingArcticleProps = {
  header: string;
  title: string;
  description: string;
  imgSrc?: string;
  orientation?: "left" | "right";
}

function FeatureArcticle({ header, title, description, imgSrc, orientation = "left" }: LandingArcticleProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <article className={`w-full py-3 ${orientation === "left" ? "flex flex-row" : "flex flex-row-reverse"} justify-center items-center`}>
      <section className={`flex flex-1 max-w-lg flex-col ${orientation === "left" ? "text-right" : "text-left"}`}>
        <span className="text-gray-500 text-sm tracking-wide uppercase mb-2">{header}</span>
        <span className="text-black font-bold text-3xl mb-4">{title}</span>
        <span className="text-black text-md ">{description}</span>
      </section>
      <img className={`h-96 mix-blend-multiply transition-opacity ease-in duration-500  ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setImgLoaded(true)} width={500} src={imgSrc} alt={title} />
    </article >
  )
}
