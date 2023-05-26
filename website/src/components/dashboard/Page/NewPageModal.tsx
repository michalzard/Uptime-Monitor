import { RadioGroup } from "@headlessui/react";
import { Modal, ModalActions, ModalContent, ModalTitle } from "../../customUI/Modal";
import { EyeSlashIcon, GlobeEuropeAfricaIcon, PlusIcon } from "@heroicons/react/24/solid";
import { SidebarButton } from "../Sidebar";
import { useState } from "react";
import { usePageStore } from "../../../store/pageStore";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

type NewPageModalProps = {
    isOpen: boolean;
    close: () => void;
    open: () => void;
    hidden?: boolean;
}
function NewPageModal({ isOpen, close, open, hidden = false }: NewPageModalProps) {
    const page = usePageStore();
    const navigate = useNavigate();
    const [pageType, setPageType] = useState("public");
    const pageValidation = yup.object({
        name: yup.string().min(3).max(20).required("Page name is required"),
        type: yup.string().oneOf(["public", "private"])
    });
    const { values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting } = useFormik({
        initialValues: {
            name: "",
            type: "public",
        },
        validationSchema: pageValidation,
        onSubmit: (values, form) => {
            if (values) { page.create({ name: values.name, isPublic: values.type === "public" }, navigate); close(); }
            form.resetForm();
        },
    })
    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            button={<SidebarButton hidden={hidden} onClick={open} text={"Create new page"} endIcon={<PlusIcon className="w-6 h-6" />} />}
        >
            <ModalTitle>Add new page to your account</ModalTitle>
            <form onSubmit={handleSubmit}>
                <ModalContent>
                    <section className="flex flex-col">
                        <span className="text-sm">Page Name</span>
                        <input type="text" className="border border-blue-600 outline-blue-600 rounded py-1.5 px-2  my-1" placeholder="Page name"
                            name="name" onChange={handleChange} onBlur={handleBlur} value={values.name} tabIndex={-1} />
                        <span className="text-red-600 text-sm">{errors.name && touched.name ? errors.name : ""}</span>
                        <span className="text-sm">Page Type</span>
                        <span className="text-xs my-1">Public pages are available to see for everyone,
                            however private pages are only accessible to authorized users.</span>
                    </section>
                    <RadioGroup value={pageType} onChange={setPageType} className="my-2 cursor-pointer">
                        <RadioGroup.Option value="public">
                            {
                                ({ checked }) => (<span className={`flex items-center ${checked ? "bg-green-400 text-white" : ""} 
                                        w-full p-2 rounded-md text-md font-semibold`} onClick={() => setFieldValue("type", "public")}><GlobeEuropeAfricaIcon className="w-5 h-5 mr-1" />Public</span>)
                            }
                        </RadioGroup.Option>
                        <RadioGroup.Option value="private">
                            {
                                ({ checked }) => (<span className={`flex items-center ${checked ? "bg-green-400 text-white" : ""} 
                                        w-full p-2 rounded-md text-md font-semibold`} onClick={() => setFieldValue("type", "private")}><EyeSlashIcon className="w-5 h-5 mr-1" />Private</span>)
                            }
                        </RadioGroup.Option>
                    </RadioGroup>
                </ModalContent>
                <ModalActions>
                    <button type="button" onClick={close} className="px-4 py-1.5 text-sm text-blue-700  font-semibold rounded">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-blue-700 px-4 py-1.5 text-sm text-white font-semibold rounded">Add page</button>
                </ModalActions>
            </form>
        </Modal >
    )
}

export default NewPageModal;