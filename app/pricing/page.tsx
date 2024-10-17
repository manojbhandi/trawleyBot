
import Pricing from "@/components/ui/Pricing/Pricing";
import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Subscriptions from "../dashboard/subscriptions/page";
import { redirect } from 'next/navigation'
// import { Router } from "next/router";

export const metadata: Metadata = {
  title: "Pricing Models",
  // description: "This is Contact Page for Startup Nextjs Template",
};

const ContactPage = async () => {
  const supabase = createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase)
  ]);
  return (
    <>

      <Navbar user={user} />
      {!user ?
        <Pricing
          user={user}
          products={products ?? []}
          subscription={subscription}
        /> : redirect('/dashboard/subscriptions')
      }

    </>
  );
};


export default ContactPage;

