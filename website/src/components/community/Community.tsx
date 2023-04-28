import { UserGroupIcon } from "@heroicons/react/24/solid";

export default function Community() {
    return (
        <div className="w-full h-full bg-slate-50 flex flex-col">
            <article className="w-full h-96 bg-slate-100 flex flex-col justify-center items-center px-10">
                <section className="flex flex-col">
                    <div className="flex">
                        <UserGroupIcon width={25} />
                        <span className="ml-2 text-xl font-semibold">Community</span>
                    </div>
                    <div className="inline-block">
                        This is the place to discuss anything and everything
                        <span className="text-blue-700 mx-1">Sentinel</span>related with the entire
                        <span className="text-blue-700 mx-1">Sentinel</span>community.<br />
                        If you have problems or are looking for help, this is your place.
                    </div>
                </section>
                {/* <span className="text-blue-700 text-2xl font-bold tracking-widest">SENTINEL</span> */}
            </article>
            <article className="w-full h-full">
                TODO: show forum here
            </article>
        </div>
    )
}

