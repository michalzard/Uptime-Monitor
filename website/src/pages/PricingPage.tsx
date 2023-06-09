import { CheckIcon } from "@heroicons/react/24/solid";
import PricingConfig from "../pricingConfig.json";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import { useAuthStore } from "../store/authStore";

type PricingOptions = {
    title: string;
    price?: number;
    description: string;
    features?: string[];
}


const PricingPage = () => {
    return (
        <div className="bg-slate-50 w-full h-[calc(100vh-64px)] flex justify-center items-center p-4 pb-10 flex-wrap 
        [&>:nth-child(3)]:h-auto [&>:nth-child(4)]:h-auto">
            {
                PricingConfig.map((config, i) => (
                    <PricingPanel key={i} price={config.price} title={config.title} description={config.description} features={config.featureList} />
                ))
            }
        </div>
    )
}

export default PricingPage;

const PricingPanel = (props: PricingOptions) => {
    const navigate = useNavigate();
    const app = useAppStore();
    const auth = useAuthStore();
    return (
        <section className="w-72 h-96 flex flex-col items-center border m-2 py-2 px-4 border-slate-300 ">
            <p className="text-2xl mb-2 font-semibold tracking-wide">{props.title}</p>
            <p className="flex justify-center">
                <span className="text-md font-semibold self-start my-1 mr-1 text-gray-600">€</span>
                <span className="text-5xl font-semibold">{props.price ? props.price : 0}</span>
                <span className="text-xl  self-end font-light text-gray-600">/m</span>

            </p>
            {/* TODO: add stripe integration */}
            <button onClick={() => { app.selectHeaderIndex(10); auth.isLoggedIn ? navigate("/dashboard") : navigate("/signup") }} className="bg-blue-700 text-white font-medium py-1 px-6 rounded my-4">Select plan</button>
            <p className="text-center px-4 font-semibold text-gray-600 mb-6"> {props.description}</p>
            <div className="overflow-auto flex flex-col items-center">
                {
                    props.features?.map((perk, i) => {
                        return <p key={i} className="w-full flex text-sm text-gray-600 mb-1"><CheckIcon className="w-5 h-5 stroke-blue-700 mr-3" />{perk}</p>
                    })
                }
            </div>
        </section>
    )
}
/**
 * Free Tier -> 0/m -> 1 page -> 10 components per page -> email notification , 15  subscribers (sub to get updates) 
 * Hobby tier -> 20/m -> 3 pages -> 25 components per page -> email notification , 200 subscribers 
 * Starter Tier -> 59/m -> 5 pages, email/sms notifications, 500 subscribers =>
 * customizable status page banner,2FA,removeable powered by,custom domain
 * Pro Tier -> 99/m ->  10 pages -> email/sms/webhook notifications -> 1000 subscribers ->
 * customizable status page banner,2FA,removeable powered by, custom domain
 */