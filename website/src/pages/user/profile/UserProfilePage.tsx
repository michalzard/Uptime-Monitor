import { PlusIcon } from "@heroicons/react/24/solid";
import { useAuthStore } from "../../../store/authStore";
import { useCallback, useEffect, useState } from "react";
import { LoadingSpinner } from "../../../Icons";
import UserProfile from "./UserProfile";
import ThirdPartyProfile from "./ThirdPartyProfile";

function UserProfilePage() {
  const { user } = useAuthStore();
  const [serviceToDisplay, setServiceToDisplay] = useState("");
  /** TODO:
   * Check if user logged in with service for via default
   * if default let them change info otherwise show read only
   * 
   */
  const renderProfileByService = (service: string) => {
    switch (service) {
      case "github": return <ThirdPartyProfile service="github" />;
      case "google": return <ThirdPartyProfile service="google" />;
      case "normal": return <UserProfile />;
    }
  }

  useEffect(() => {
    if (user?.service) setServiceToDisplay(user.service);
    return () => setServiceToDisplay("");
  }, [user?.service]);
  return (
    <article className="w-full lg:w-[calc(100vw-300px)] h-full flex flex-col items-center justify-center p-5">

      <span className="text-black font-bold text-3xl">User Profile</span>

      {
        renderProfileByService(serviceToDisplay)
      }

    </article>
  )
}

export default UserProfilePage;
