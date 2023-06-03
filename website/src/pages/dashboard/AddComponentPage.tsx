import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import UptimeStatus from "../../components/UptimeStatus";
import { useFormik } from "formik";
import * as yup from "yup";


function AddComponentPage() {
    const navigate = useNavigate();
    const inputClass = `w-full focus:outline-blue-500 disabled:text-gray-400 border-gray-300 bg-gray-50 placeholder:text-gray-500 px-3 py-1.5 rounded-sm ring-1 ring-black/10`;
    const smallLabelclass = `text-left text-gray-400 text-xs my-2 font-semibold`;
    const [displayUptime, setDisplayUptime] = useState(true);


    const componentValidationSchema = yup.object({
        name: yup.string().min(5).max(100).required(),
        description: yup.string().min(5).max(1000).required(),
        startDate: yup.date().required(),
    })
    const { values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue } = useFormik({
        initialValues: {
            name: "",
            description: "",
            startDate: new Date(),
        },
        validationSchema: componentValidationSchema,
        onSubmit(values, form) {
            console.log(values);
        },
    });

    console.log(values, errors);
    return (
        <article className="w-full lg:w-[calc(100vw-300px)] h-full flex flex-col items-center lg:justify-center px-2">
            {/* heading */}
            <div className="w-full lg:w-1/2">

                <section className="flex justify-between items-center">
                    <span className="text-2xl font-semibold">Add component</span>
                    <button className="text-blue-700 font-semibold" onClick={() => navigate(-1)}>Back to components</button>
                </section>

                <section className="my-2">
                    <label className={smallLabelclass}>Component name</label>
                    <input type="text" className={inputClass} id="name" value={values.name} onBlur={handleBlur} onChange={handleChange} placeholder="Component name" />

                    <label className={smallLabelclass}>Description (optional)</label>
                    <textarea className={inputClass} id="description" value={values.description} onBlur={handleBlur} onChange={handleChange} placeholder="Website and Server applications" rows={5} />
                    <label className={"text-left text-gray-400 text-xs my-2"}>Write a helpful description of what this component shows/does</label>

                    <section className="flex flex-col">
                        <label className={smallLabelclass}>Display uptime</label>
                        <div>
                            <input type="checkbox" onBlur={handleBlur} checked={displayUptime} onChange={(e) => setDisplayUptime(e.target.checked)} className="cursor-pointer" />
                            <label className="ml-2 text-sm ">Display historical status of this component</label>
                        </div>
                        {
                            displayUptime ?
                                <>
                                    <label className={smallLabelclass}>Start date</label>
                                    <DatePicker className={inputClass} id="startDate" format={"DD-MM-YYYY"} defaultValue={dayjs(values.startDate)} onBlur={handleBlur}
                                        onChange={date => setFieldValue("startDate", dayjs(date).toDate() as Date)} />

                                    <label className={smallLabelclass}>Uptime status monitor showcase</label>
                                    <UptimeStatus showTimeline />
                                </>
                                : null
                        }

                    </section>
                    <div className="flex justify-end py-2">
                        <button type="submit" className="text-white font-semibold bg-blue-700 px-4 py-1.5 rounded-md">Save component</button>
                    </div>
                </section>
            </div>

        </article>
    )
}

export default AddComponentPage;