'use client'

import { routes } from "@/utils/routes"
import Link from "next/link"
import { useState } from "react"
import Button from "../Button"
import CustomizeBanner from "./CustomizeBanner"

interface CookieConsentBannerProps {
    acceptAllCookies: () => void
    rejectAllCookies: () => void
    customizeCookies: () => void
    closeBanner: () => void
    loading: boolean
    openCustomBanner: boolean
    setOpenCustomBanner: (value: boolean) => void
}
export default function CookieConsentBanner(props: CookieConsentBannerProps) {
    const { acceptAllCookies, rejectAllCookies, customizeCookies, closeBanner, loading, openCustomBanner, setOpenCustomBanner } = props
    // const [openConsentBanner, setOpenConsentBanner] = useState<boolean>(true)

    const closeCustomizedConsentBanner = () => {
        setOpenCustomBanner(false)
    }
    return (
        <>
            <div className="fixed flex flex-col md:flex-row items-center justify-center gap-4 bottom-0 left-0 right-0 bg-slate-200  text-primary p-5 text-center z-[300] shadow-lg " >
                <div className="flex flex-col">
                    {/* <h6 className="font-bold mr-auto">We value your privacy</h6> */}
                    <p className="text-sm mb-2 font-medium">
                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking <strong>"Accept All"</strong>, you consent to our use of cookies. <Link href={`${routes.cookiePolicy}`} className="underline"> Cookie Policy</Link>
                    </p>
                </div>
                <div className="flex justify-center space-x-4 md:flex-row flex-col md:gap-0 gap-3 flex-wrap md:flex-nowrap">
                    <Button
                        variant="slim"
                        loading={loading}
                        type="button"
                        className="whitespace-nowrap"
                        onClick={() => {
                            acceptAllCookies()
                            closeBanner()
                        }}
                    >
                        Accept All
                    </Button>
                    <Button
                        variant="slim"
                        type="button"
                        className=" bg-zinc-300 hover:scale-[.98] ease-in-out transform "
                        style={{ backgroundColor: 'white', color: '#4A6CF7', border: '2px solid #4A6CF7' }}
                        onClick={() => {
                            setOpenCustomBanner(true)
                            closeBanner()
                        }}
                    >
                        Customize
                    </Button>
                    <Button
                        variant="slim"
                        loading={loading}
                        className="whitespace-nowrap"
                        type="button"
                        onClick={() => {
                            rejectAllCookies()
                            closeBanner()
                        }}
                    >
                        Reject All
                    </Button>
                </div>
            </div>
            {/* {
                openCustomBanner ?
                    <CustomizeBanner
                        closeBanner={closeCustomizedConsentBanner}
                        acceptAllCookies={acceptAllCookies}
                        rejectAllCookies={rejectAllCookies}
                        openConsentBanner={openCustomBanner}
                        
                    />
                    : null
            } */}
        </>
    )

}
