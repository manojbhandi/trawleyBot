export const pageView = (url:string) => {
    window.gtag('config', process.env.GA_MEASUREMENT_ID as string, {
        page_path: url,
    });
}