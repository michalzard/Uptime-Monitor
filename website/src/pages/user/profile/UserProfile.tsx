import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { PlusIcon, UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";

function UserProfile() {
    const inputClass = `focus:outline-blue-500 disabled:text-gray-400 border-gray-300 mb-1.5 bg-gray-50 placeholder:text-gray-700 px-3 py-1.5 rounded-sm ring-1 ring-black/10`;
    const buttonClass = `bg-blue-600 px-3 py-1.5 rounded-md text-white font-semibold disabled:bg-gray-400 disabled:text-gray-200 w-full`;
    const labelClass = `text-gray-700 font-semibold text-lg my-1`;
    const smallerLabelClass = `text-gray-700 font-semibold text-sm my-1.5`;
    const [pfpHovered, setPfpHovered] = useState(false);
    const { user } = useAuthStore();

    const imgOnClick = useCallback(() => {
        document.getElementById("avatar_upload")?.click();
    }, []);
    /**
     * add functionality to save profile picture,preview prof before upload
     * add func to update username and email
     * add same func for just pasword itself
     */
    // file preview
    const [preview, setPreview] = useState("");
    return (
        <>
            <section className="w-full lg:w-96 my-2">
                <label className={labelClass}>General Info</label>
                <input type="file" id="avatar_upload" accept=".png,.jpg,.webp" onChange={(e) => {
                    if (e.target.files) {
                        const file = e.target.files[0];
                        const formData = new FormData();
                        formData.append("pfp", file);
                        axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, { withCredentials: true }).then(res => {
                            const { message } = res.data;
                            if (message) console.log(message);
                        }).catch(console.error);
                        // show in preview
                        const previewURL = URL.createObjectURL(file);
                        setPreview(previewURL);
                    }
                }} className="hidden" />
                <div
                    onMouseEnter={() => setPfpHovered(true)}
                    onMouseLeave={() => setPfpHovered(false)}
                    onClick={imgOnClick}
                    className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
                    style={{ filter: pfpHovered ? "grayscale(100%)" : "none" }}
                >
                    <div
                        className="bg-blue-700 rounded-full w-full h-full flex items-center justify-center"
                        style={{ filter: pfpHovered ? "blur(1px)" : "none" }}
                    >
                        {user?.avatar_url || preview ? <img src={preview ? preview : user?.avatar_url} onMouseEnter={() => setPfpHovered(true)} onMouseLeave={() => setPfpHovered(false)} onClick={imgOnClick}
                            className="w-12 h-12 rounded-full cursor-pointer" />
                            :
                            <UserIcon className="w-8 h-8 text-white z-10" />
                        }
                    </div>
                    {/* img overlay  */}
                    <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none ${pfpHovered ? "visible" : "hidden"}`}
                    >
                        <PlusIcon className="w-10 h-10 text-white" />
                    </div>
                </div>


                <div className="flex flex-col my-2">
                    <label className={smallerLabelClass}>Username</label>
                    <input type="text" defaultValue={user?.username} className={inputClass} />
                    <label className={smallerLabelClass}>Email</label>
                    <input type="text" defaultValue={user?.email} className={inputClass} />
                </div>

                <button type="submit" className={buttonClass}>Save changes</button>

            </section>

            <section className="w-full lg:w-96 flex flex-col">
                <label className={labelClass}>Password</label>
                <label className={smallerLabelClass}>New Password</label>

                <input type="password" className={inputClass} />

                <label className={smallerLabelClass}>Verify Password</label>
                <input type="password" className={inputClass} />
                <button type="submit" className={buttonClass} >Save changes</button>
            </section>
        </>
    )
}

export default UserProfile;