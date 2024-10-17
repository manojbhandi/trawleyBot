"use client";

import CollapseSidebarOpen from "@/components/icons/CollapseSidebarOpen";
import CollapseSidebar from "@/components/icons/CollaseSidebar";
import CreditCard from "@/components/icons/CreditCard";
import Gear from "@/components/icons/Gear";
import HomeIcon from "@/components/icons/Home";
import Logo from "@/components/icons/Logo";
import SignOutIcon from "@/components/icons/SignOut";
import { handleRequest } from "@/utils/auth-helpers/client";
import { SignOut } from "@/utils/auth-helpers/server";
import { getRedirectMethod } from "@/utils/auth-helpers/settings";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useLocalStorage from "../../../ui/hooks/useLocalStorage";
import SidebarItem from "./SidebarItem";
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: (
          <HomeIcon />
        ),
        label: "Home",
        route: "/dashboard",
      },

      {
        icon: (
          <CreditCard />
        ),
        label: "Subscriptions",
        route: "/dashboard/subscriptions",
      },

      {
        icon: (
          <Gear />
        ),
        label: "Settings",
        route: "/dashboard/settings",
      },


    ],
  },

];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  return (
    // <ClickOutside onClick={() => setSidebarOpen(false)}>
    <div className="relative">
      <aside
        className={`fixed  left-0 top-0 z-[100] flex flex-col h-screen transition-all ease-in-out bg-primary bg-opacity-80 dark:bg-boxdark 
      ${sidebarOpen ? "w-72 duration-300" : "w-15 duration-300"} ${!sidebarOpen ? "items-center" : ""}`}

      >
        {/* <!-- SIDEBAR HEADER --> */}

        <div className={` flex px-2 justify-between items-center ${sidebarOpen ? 'flex-row' : 'flex-col'}`}>
          <div className="flex items-center  justify-between gap-2 px-6 py-5 lg:py-6">
            <Link href="/"
              className={`flex gap-2 items-center header-logo w-full `}
            >
              <Logo />
              <span className={`text-2xl font-bold text-white ${sidebarOpen ? 'block' : 'hidden'}`}>saas</span>
            </Link>
          </div>
          <div>
            <button
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
              }}
              className={`text-primary absolute border-2 border-black rounded-full flex items-center justify-center p-1 right-[-10px] top-[1.9rem] bg-graydark transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`}
              style={{ width: '22px', height: '22px' }} // Optional to control size
            >
              <CollapseSidebar />
            </button>
          </div>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear text-white">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <ul className="mb-6 flex flex-col gap-1.5 overflow-hidden">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                      sidebarOpen={sidebarOpen}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
        <div className="mt-auto flex flex-col gap-8  pt-2">
          <form onSubmit={(e) => {
            e.preventDefault()
            handleRequest(e, SignOut, router)
          }}>
            {
              <button
                type="submit"
                className={`w-fit px-14 py-2 mt-auto mb-5 mx-auto flex items-center gap-2 duration-500 ease-in-out transform 
                ${sidebarOpen ? ' bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ' : 'bg-inherit hover:bg-black'}text-primary font-bold rounded-full text-base dark:text-white`}
              >
                <SignOutIcon sidebarOpen={sidebarOpen} ></SignOutIcon>
                <span className={`transition-all text-primary ease-in-out inline-block overflow-hidden whitespace-nowrap
            ${sidebarOpen ? 'opacity-100 delay-100 w-full ' : 'opacity-0 w-0'}`}>Sign out</span>
              </button>
            }
          </form>
        </div>
      </aside>
    </div>
    // </ClickOutside>
  );
};

export default Sidebar;
