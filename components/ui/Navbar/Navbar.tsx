"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";

import { handleRequest } from "@/utils/auth-helpers/client";
import { SignOut } from "@/utils/auth-helpers/server";
import { getRedirectMethod } from "@/utils/auth-helpers/settings";
import { createClient } from "@/utils/supabase/client";
import Logo from "@/components/icons/Logo";
import { getUser } from "@/utils/supabase/queries";

interface NavProps {
  user?: any;
}
const Header = (props: NavProps) => {
  // Navbar toggle
  const { user } = props;
  //  const [user,setUser] = useState<any>(null)
  const supabase = createClient();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };
  const [sticky, setSticky] = useState(false);

  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  // const getUserFn = async () => {
  //   const userData = await getUser(supabase)
  //   if(userData){
  //    setUser(userData)
  //   }else{
  //     return null
  //   }
  //   // return data.user;
  // }
  // useEffect(() => {
  //   getUserFn();

  // }, []);
  // useEffect(()=>{
  //   console.log(user,"user")
  // },[user])

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });
  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: any) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const usePathName = usePathname();

  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const isDashboard = usePathName.startsWith('/dashboard');

  return (
    <>
      <header
        className={`header right-0 top-0 z-40 flex items-center h-16 ${isDashboard ? "w-[calc(100%-18rem)] border-2 border-red-500" : "w-full"}
           ${sticky
            ? "dark:bg-gray-dark dark:shadow-sticky-dark fixed z-[9999] bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition"
            : "absolute bg-transparent"}
           `}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            {
              !isDashboard && <div className="w-60 max-w-full px-4 xl:mr-12">
                <Link
                  href="/"
                  className={`header-logo block w-full ${sticky ? "py-5 lg:py-2" : "py-8"
                    } `}
                >
                  <Logo />
                </Link>
              </div>
            }
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? " top-[7px] rotate-45" : " "
                      }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? "opacity-0 " : " "
                      }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${navbarOpen ? " top-[-8px] -rotate-45" : " "
                      }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${navbarOpen
                    ? "visibility top-full opacity-100"
                    : "invisible top-[120%] opacity-0"
                    }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${usePathName === menuItem.path
                              ? "text-primary dark:text-white"
                              : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                              }`}
                          >
                            {menuItem.title}
                          </Link>
                        ) : null}

                      </li>
                    ))}
                    {!user ?
                      <>
                        <Link
                          href={"/pricing"}
                          className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${usePathName === '/pricing'
                            ? "text-primary dark:text-white"
                            : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                            }`}
                        >
                          Pricing
                        </Link>
                      </> : null
                    }
                    {
                      user ?
                        <>

                          <Link
                            href={"/dashboard"}
                            className={`flex py-2 text-base lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${usePathName === '/dashboard'
                              ? "text-primary dark:text-white"
                              : "text-dark hover:text-primary dark:text-white/70 dark:hover:text-white"
                              }`}
                          >
                            Dashboard
                          </Link>
                        </> : null
                    }


                  </ul>
                </nav>
              </div>
              {
                <div className="flex items-center justify-end pr-16 lg:pr-0">
                  {
                    user ? (
                      <form onSubmit={(e) => {
                        handleRequest(e, SignOut, router)
                        // setUser(null)
                      }}>
                        <input type="hidden" name="pathName" value={usePathname()} />
                        <button type="submit"
                          className="absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white font-bold px-8 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hidden text-base   hover:opacity-70 dark:text-white md:block"
                        >
                          Sign out
                        </button>
                      </form>
                    ) : (
                      <Link
                        href="/signin"
                        className="absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white font-bold px-8 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hidden text-base   hover:opacity-70 dark:text-white md:block"

                      >
                        Sign In
                      </Link>
                    )
                  }

                </div>
              }
              {/* <div>
                <ThemeToggler />
              </div> */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
