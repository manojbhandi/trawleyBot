import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import Hero from '@/components/ui/Hero';
import Features from '@/components/ui/Features';
import Video from '@/components/ui/Video';
import Brands from '@/components/ui/Brands';
import AboutSectionOne from '@/components/ui/About/AboutSectionOne';
import AboutSectionTwo from '@/components/ui/About/AboutSectionTwo';
import Testimonials from '@/components/ui/Testimonials';
import Blog from '@/components/ui/Blog';
import Contact from '@/components/ui/Contact';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import Pricing from '@/components/ui/Pricing/Pricing';
import RealTimeNotification from '@/components/ui/SubscriptionNotification/RealTimeNotification';


import ConsentBanner from '@/components/ui/CookieConsent/page';
export default async function PricingPage() {
  const supabase = createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase)
  ]);
  // console.log(user, "u", products, "p", subscription, "s", subscription?.prices?.unit_amount,"amount");

  return (
    <>
      <Navbar user={user} />
      <Hero />
      <Features />
      <Video />
      <Brands />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Testimonials />
      <Blog />
      <Pricing
        user={user}
        products={products ?? []}
        subscription={subscription}
      />
      <Contact />
      <Footer />
      {/* <ConsentBanner/> */}
      {
        subscription?.prices?.unit_amount > 0 ?
           null : 
           <RealTimeNotification /> 
      }

      {/* <CookieConsentTabs/> */}
    </>
  );
}
