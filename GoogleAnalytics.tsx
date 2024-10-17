'use client'
import React, { useEffect } from 'react';
import Script from 'next/script';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { pageView } from './utils/tagHelper/pageView';

const GoogleAnalytics = ({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) => {
    const pathName = usePathname()
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = `${pathName}${searchParams}`;
        pageView(url);
    }, [pathName, searchParams])

    return (
        <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=G-LFE0ZL1LDN`}></Script>
            <Script id='google-analytics' strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('consent', 'default', {
                    'analytics_storage': 'denied'
                });
                
                gtag('config', G-LFE0ZL1LDN, {
                    page_path: window.location.pathname,
                });
                `,
                }}
            />
        </>


    );
};

export default GoogleAnalytics;