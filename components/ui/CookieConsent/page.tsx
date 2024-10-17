'use client'

import React, { useEffect, useState } from 'react'
import Button from '../Button'
import CookieConsentBanner from './CookieConsentBanner'
import { getClientSideCookie, setClientSideCookie } from '@/utils/client-cookie/cookies-helper'
import CustomizeBanner from './CustomizeBanner'

function ConsentBanner() {
    const [openConsentBanner, setOpenConsentBanner] = React.useState(false)
    const [openCustomBanner, setOpenCustomBanner] = React.useState(false)

    const [loading, setLoading] = useState<boolean>(false)
    const acceptAllCookies = () => {
        setLoading(true)
        console.log('accept all cookies')
        window.gtag("consent", 'update', {
            'analytics_storage': 'granted'
        });
        setClientSideCookie(
            'cookie_consent', 'granted', {
            path: '/',
            expires: 180 * 24 * 60 * 60,
            secure: true,
            sameSite: 'Lax'
        })
        setLoading(false)
    }
    const rejectAllCookies = () => {
        setLoading(true)
        console.log('reject all cookies')
        window.gtag("consent", 'update', {
            'analytics_storage': 'denied'
        });
        setClientSideCookie(
            'cookie_consent', false
        )
        setLoading(false)
    }

    const customizeCookies = () => {
        console.log('customize cookies')
    }

    const closeBanner = () => {
        setOpenConsentBanner(false)
    }

    useEffect(() => {
        const cookieConsent = getClientSideCookie('cookie_consent')
        if (!cookieConsent) {
            setOpenConsentBanner(true)
        } else {
            setOpenConsentBanner(false)
        }
    }, [])

    const cancelCustomBanner = () => {
        setOpenCustomBanner(false)
        setOpenConsentBanner(true)
    
    }

    return (
        <>
            {
                openConsentBanner ?
                    <CookieConsentBanner
                        acceptAllCookies={acceptAllCookies}
                        rejectAllCookies={rejectAllCookies}
                        customizeCookies={customizeCookies}
                        openCustomBanner={openCustomBanner}
                        setOpenCustomBanner={setOpenCustomBanner}
                        closeBanner={closeBanner}
                        loading={loading}

                    /> : null
            }
            {

                openCustomBanner ?
                    <CustomizeBanner
                        closeBanner={()=>setOpenCustomBanner(false)}
                        acceptAllCookies={acceptAllCookies}
                        rejectAllCookies={rejectAllCookies}
                        cancelCustomBanner={cancelCustomBanner}
                        openConsentBanner={openCustomBanner}
                    />
                    : null

            }

        </>
    )
}

export default ConsentBanner