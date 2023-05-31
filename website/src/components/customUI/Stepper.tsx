import { useState } from "react";

type StepProps = {
    index: number;
    label?: string;
    activeStep: number;
    active: boolean;
    lastStep?: boolean;
    selectStep: () => void;
}
type StepperProps = {
    steps: string[];
    activeStep?: number;
    selectStep?: () => void;
}

function Stepper({ steps, activeStep = 1 }: StepperProps) {
    const [currentStep, setCurrentStep] = useState(activeStep);
    return (
        <div className="flex w-full justify-around items-center">
            {
                steps.map((step, i) => <Step key={i} index={i + 1} label={step} selectStep={() => setCurrentStep(i + 1)}
                    active={i + 1 === currentStep} activeStep={currentStep} lastStep={i + 1 === steps.length} />)
            }

        </div>
    )
}

export default Stepper;

// circle with info in it
export function Step({ index, label, active, activeStep, lastStep, selectStep }: StepProps) {
    return <>
        <div className="flex flex-col justify-center items-center mx-.5 cursor-pointer" onClick={selectStep}>
            {/* number in circle */}
            <div className="flex items-center">
                <div className={`${index <= activeStep ? "bg-blue-700" : "bg-gray-400"} rounded-full w-8 h-8 flex items-center justify-center text-white font-semibold`}>
                    {index}
                </div>

            </div>
            {/* name of the thing */}
            <label className={`text-sm lg:text-md mt-2 font-semibold ${active ? "text-blue-700" : "text-black"}`}>{label}</label>
        </div>
        {
            lastStep ? null : <div className={`ml-1 w-full h-0.5 -translate-y-3 ${activeStep > index ? "bg-blue-700" : "bg-gray-400"}`} />
        }
    </>
}