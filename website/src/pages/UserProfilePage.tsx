import { useAuthStore } from "../store/authStore";

function UserProfilePage() {
  const { user } = useAuthStore();
  console.log(user);
  const inputClass = `focus:outline-blue-500 disabled:text-gray-400 border-gray-300 mb-2 bg-gray-50 placeholder:text-gray-700 px-3 py-1.5 rounded-sm`;
  const buttonClass = `bg-green-700 px-3 py-1.5 rounded-md text-white font-semibold`;
  /**
   * Check if user logged in with service for via default
   * if default let them change info otherwise show read only
   * 
   */
  return (
    <article className="w-full h-full flex items-center justify-center">

      <section>
        <span className="text-black font-semibold text-xl">User Profile</span>

        <div className="my-2">
          <input type="file" id="avatar_upload" accept=".png,.jpg,.webp" className="hidden" />
          <img src={user?.avatar_url} onClick={() => document.getElementById("avatar_upload")?.click()} className="w-14 h-14 rounded-full cursor-pointer" />
          <div className="flex flex-col">
            <input type="text" defaultValue={user?.username} className={inputClass} disabled={user?.service ? true : false} />
            <input type="text" defaultValue={user?.email} className={inputClass} disabled={user?.service ? true : false} />

          </div>
          <button className={buttonClass}>Save changes</button>
        </div>
        <hr className="my-4"/>
        {/* TODO: figure out what you want here to display */}
        <div>

        </div>
      </section>
    </article>
  )
}

export default UserProfilePage;