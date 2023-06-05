import { useMemo } from "react";

type UptimeStatusProps = {
    data?: any[];
    showTimeline?: boolean;
}
function UptimeStatus({ showTimeline = false, data = [] }: UptimeStatusProps) {
    const defaultData = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 60; i++) {
            if (i < 58) arr.push({ status: "" });
            else {
                arr.push({ status: "operational" });
            }
        }
        return arr;
    }, []);

    return (
        <div className="ring-2 ring-black/10 p-4">
            <section className={`flex justify-between ${showTimeline ? "mb-2" : ""}`}>
                <span className="text-md font-semibold">API (Example)</span>
                <span className="text-md font-semibold text-green-500">Operational</span>
            </section>
            {
                showTimeline ?
                    <>
                        <section className="w-full h-20">
                            <svg className="w-full h-full ">
                                {
                                    // TODO: on mobile scale timeline to show whole svg correctly
                                    data.length > 0 ? data.map((r, i) => <rect key={i} x={12.8 * i} className={`w-2.5 h-full text-gray-400 hover:text-gray-300`} fill="currentColor" />)
                                        : defaultData.map((r, i) => <rect key={i} x={12.8 * i} className={`w-2.5 h-full ${r.status === "operational" ? "text-green-400" : "text-gray-400"}   hover:text-gray-300`} fill="currentColor" />)
                                }
                            </svg>
                        </section>
                        <section className="flex items-center justify-between p-1 text-gray-400 font-semibold text-sm">
                            <span>60 days ago</span>
                            <span>100.0% uptime</span>
                            <span>Today</span>
                        </section>
                    </>
                    : null
            }

        </div>
    )
}

export default UptimeStatus