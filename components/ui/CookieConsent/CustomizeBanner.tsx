import React, { useEffect, useState } from 'react'
import Button from '../Button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/Common/Accordian'
import { Switch } from '@/components/Common/Switch'

interface CustomizedBannerProps {
  closeBanner: () => void,
  acceptAllCookies: () => void
  rejectAllCookies: () => void
  cancelCustomBanner: () => void
  openConsentBanner: boolean
}

function CustomizeBanner(props: CustomizedBannerProps) {
  const { closeBanner, acceptAllCookies, rejectAllCookies, openConsentBanner, cancelCustomBanner } = props
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (openConsentBanner) {
      setShowModal(true);
    } else {
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [openConsentBanner]);
  return (
    <div className={`fixed inset-0  bg-white bg-opacity-70 flex items-center justify-center z-[500] shadow-2xl transition-all duration-300 ease-in-out ${showModal ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`w-[70%] max-h-[80vh]  h-auto bg-white pb-6 overflow-auto pt-2 rounded-lg shadow-xl flex flex-col items-center transform transition-transform duration-300 ease-in-out  justify-center ${openConsentBanner ? 'translate-y-0' : 'translate-y-full'} `}>
        {/* <hr className="border-2 border-gray w-full " /> */}
        <div className='flex items-center justify-between w-full px-5'>
          <h1 className=" font-bold text-xl">Customize Consent Preferences</h1>
          <button className="m-2 mr-0 text-gray-500 hover:text-gray-700 " onClick={cancelCustomBanner}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <hr className="border-2 border-gray w-full " />
        <div className='px-10 py-5'>
          <div className=''>
            <h4>This website uses cookies</h4>
            <p> We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.</p>
          </div>
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1 flex">
                <div className="flex items-center justify-between ml-auto">
                  <AccordionTrigger>Necessary</AccordionTrigger>
                  <Switch
                    checked={true}
                    // onCheckedChange={() => { }}
                  />
                </div>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1 flex">
                <div className="flex items-center justify-between ml-auto">
                  <AccordionTrigger>Analytics</AccordionTrigger>
                  <Switch
                    checked={true}
                    onCheckedChange={() => { }}
                  />
                </div>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1 flex">
                <div className="flex items-center justify-between ml-auto">
                  <AccordionTrigger>Performance</AccordionTrigger>
                  <Switch
                    checked={true}
                    onCheckedChange={() => { }}
                  />
                </div>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1 flex">
                <div className="flex items-center justify-between ml-auto">
                  <AccordionTrigger>Advertisement</AccordionTrigger>
                  <Switch
                    checked={true}
                    onCheckedChange={() => { }}
                  />
                </div>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <hr className="border-2 border-gray mb-2 w-full " />

        <div className="flex justify-center items-center gap-4 md:gap-0 md:flex-row flex-col space-x-4">
          <Button
            variant="slim"
            className=''
            type="button"
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
            className="  hover:scale-[.98] ease-in-out transform"
            style={{ backgroundColor: 'white', color: '#4A6CF7', border: '2px solid #4A6CF7', }}
            onClick={() => closeBanner()}
          >
            Save My Preferences
          </Button>
          <Button
            variant="slim"
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
    </div >
  )
}

export default CustomizeBanner