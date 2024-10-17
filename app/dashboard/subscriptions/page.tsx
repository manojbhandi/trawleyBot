
import { createClient } from '@/utils/supabase/server';
import {
    getProducts,
    getSubscription,
    getUser
} from '@/utils/supabase/queries';
import Pricing from '@/components/ui/Dashboard/Subscriptions/Pricing';
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "Subscriptions",
    // description: "This is Contact Page for Startup Nextjs Template",
  };
const Subscriptions = async () => {
    const supabase = createClient();
    const [user, products, subscription] = await Promise.all([
        getUser(supabase),
        getProducts(supabase),
        getSubscription(supabase)
    ]);
    return (
        <>
            <Pricing
                user={user}
                products={products ?? []}
                subscription={subscription}
            />

        </>
    )
}
export default Subscriptions