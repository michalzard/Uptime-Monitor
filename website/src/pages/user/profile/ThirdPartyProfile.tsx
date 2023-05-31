import { useCallback } from "react";
import { GithubIcon, GoogleIcon } from "../../../Icons";

type ThirdPartyProfileProps = {
  service: string;
}

function ThirdPartyProfile({ service }: ThirdPartyProfileProps) {

  const renderThirdPartyProfile = useCallback((service: string) => {
    // renders profile by service
    switch (service) {
      case "github": return <>
        <span className="text-lg mb-4">In order to change your<b className="mx-1 inline-block">Github</b>credentials you need to visit
          <u className="mx-1">Github's security settings</u></span>
        <a href="https://github.com/settings/security" className="flex items-center justify-center  bg-black text-white text-lg font-semibold px-3.5 py-2 rounded-md">
          <GithubIcon className="w-7 h-7 mr-2 overflow-visible" />
          Github Security Settings</a>
      </>;
      case "google": return <>
        <span className="text-lg text-center mb-4">In order to change your<b className="mx-1 inline-block text-transparent">Google</b>credentials you need to visit
          <u className="mx-1">Google's personal information settings</u></span>
        <a href="https://myaccount.google.com/personal-info" className="flex items-center justify-center  bg-orange-400 text-white text-lg font-semibold px-3.5 py-2 rounded-md">
          {/*TODO: this svg is all f**** up,maybe later replace it with another one */}
          <GoogleIcon className="w-5 h-4 mr-2 -translate-x-1/2 -translate-y-1/2 overflow-visible" />
          Google Personal Info</a>
      </>;
    }

  }, []);
  return (
    <>
      {renderThirdPartyProfile(service)}
    </>
  )
}

export default ThirdPartyProfile;
