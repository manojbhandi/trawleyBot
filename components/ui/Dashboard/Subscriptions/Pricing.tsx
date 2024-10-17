'use client';
import Button from '@/components/ui/Button';
import type { Tables } from '@/types_db';
import { removeDups } from '@/utils/common-fn';
import { getErrorRedirect } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe, createStripePortal } from '@/utils/stripe/server';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import OfferList from './OfferList';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({ user, products, subscription }: Props) {
  const [featuresArr, setFeaturesArr] = useState<any[]>([])

  useEffect(() => {
    let res = products.map((prod: any) => (
      prod.description.split(", "))).flat();
    const uniqueFaturesArr = removeDups(res)

    if (uniqueFaturesArr.length > 0) {
      setFeaturesArr(uniqueFaturesArr)
    }
  }, [])
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  // const handleStripePortalRequest = async () => {
  //   setIsSubmitting(true);
  //   const redirectUrl = await createStripePortal(currentPath);
  //   setIsSubmitting(false);
  //   return router.push(redirectUrl);
  // };


  const handleSubsribeBtn = (price: Price) => {
    if (new Date(subscription?.current_period_end as string) > new Date()) {
      handleStripePortalRequest(price)
    } else {
      handleStripeCheckout(price)
    }
  }
  const handleStripePortalRequest = async (price: Price) => {
    setPriceIdLoading(price.id);
    const redirectUrl = await createStripePortal(currentPath);
    setPriceIdLoading(undefined);
    return router.push(redirectUrl);
  };
  const maxFeatures = Math.max(...products.map(product => product?.description?.split(", ").length || 0));
  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }
    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );
    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }
    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });
    setPriceIdLoading(undefined);
  };
  if (!products.length) {
    return (
      <section className="bg-white">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-black sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
        {/* <LogoCloud /> */}
      </section>
    );
  } else {
    return (

      <div className="mx-auto w-full">
        {/* <Breadcrumb pageName="Subscriptions" /> */}
        <section
          id='pricing'
          className="relative z-10 overflow-hidden bg-white pb-16  dark:bg-gray-dark   "
        >
          <div className=" max-w-6xl px-4 py-8 mx-auto  sm:px-6 lg:px-8">
            <div className=" sm:flex sm:flex-col sm:align-center">

              <div className="relative self-center mt-6 bg-white rounded-lg p-0.5 flex sm:mt-8 border border-primary">
                {intervals.includes('month') && (
                  <button
                    onClick={() => setBillingInterval('month')}
                    type="button"
                    className={`${billingInterval === 'month'
                      ? 'relative w-1/2 bg-primary border-zinc-800 text-2xl shadow-sm  text-white'
                      : 'ml-0.5 relative w-1/2 border border-transparent text-2xl '
                      } rounded-md m-1 py-2 text-sm font-medium text-black whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                  >
                    Monthly billing
                  </button>
                )}
                {intervals.includes('year') && (
                  <button
                    onClick={() => setBillingInterval('year')}
                    type="button"
                    className={`${billingInterval === 'year'
                      ? 'relative w-1/2 bg-primary  border-black shadow-sm text-white'
                      : 'ml-0.5 relative w-1/2 border  border-transparent '
                      } rounded-md m-1 py-2 text-black text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                  >
                    Yearly billing
                  </button>
                )}
              </div>
            </div>
            <div className="mt-12 space-y-0 sm:mt-16 items-stretch flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
              {products.map((product) => {
                const price = product?.prices?.find(
                  (price) => price.interval === billingInterval
                );
                if (!price) return null;
                const priceString = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: price.currency!,
                  minimumFractionDigits: 0
                }).format((price?.unit_amount || 0) / 100);

                return (
                  <div
                    key={product.id}
                    className={cn(
                      'rounded-lg h-full min-h-full relative bg-white shadow-2xl hover:shadow-xl hover:shadow-zinc-500 shadow-zinc-400',
                      {
                        'border border-primary  ': subscription
                          ? subscription?.prices?.products?.id === product.id && subscription?.prices.interval === billingInterval
                          : null
                      },
                      'flex-1',  // This makes the flex item grow to fill the space
                      'basis-1/3', // Assuming you want each card to take up roughly a third of the container's width
                      'max-w-xs' // Sets a maximum width to the cards to prevent them from getting too large
                    )}
                  >

                    {
                      !subscription && product.name === 'Hobby' ?
                        <div
                          style={{ clipPath: "polygon(17% 0%,83% 0%,96% 100%,4% 100%)" }}
                          className="flex justify-center top-28 right-[-24px] absolute w-48 bg-primary text-white text-center transform rotate-45 origin-top-right ">
                          <div className="relative w-44 bg-primary text-white text-center">
                            <span className="text-xs font-bold">Recommended</span>
                          </div>
                        </div> : null
                    }
                    <div className='p-6 flex flex-col flex-grow'>
                      <h2 className="text-2xl font-semibold leading-6 text-black mb-4">
                        {product.name}
                      </h2>
                      <div
                        style={{
                          height: maxFeatures
                            ? `${maxFeatures * 2}rem`
                            : 'auto'
                        }}
                      >
                        {
                          product?.description?.split(", ").map((feature: string, i) => (
                            <OfferList key={feature + i} text={feature} status={true} />
                          ))
                        }
                      </div>
                      <div className='mt-auto'>
                        <p className="mt-8">
                          <span className="text-5xl font-extrabold white text-black">
                            {priceString}
                          </span>
                          <span className="text-base font-medium text-black">
                            /{billingInterval}
                          </span>
                        </p>
                        <Button
                          variant="slim"
                          type="button"
                          disabled={(subscription?.prices?.products?.id === product.id && subscription?.prices.interval === billingInterval)}
                          loading={priceIdLoading === price.id}
                          onClick={() => handleSubsribeBtn(price)}
                          className={cn(
                            "block  w-full py-2 mt-8 text-sm font-semibold text-center rounded-md"
                          )}
                        >
                          {(subscription?.prices?.products?.id === product.id && subscription?.prices.interval === billingInterval) ? 'Current Plan' : 'Subscribe'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 z-[-1]">
            <svg
              width="239"
              height="601"
              viewBox="0 0 239 601"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                opacity="0.3"
                x="-184.451"
                y="600.973"
                width="196"
                height="541.607"
                rx="2"
                transform="rotate(-128.7 -184.451 600.973)"
                fill="url(#paint0_linear_93:235)"
              />
              <rect
                opacity="0.3"
                x="-188.201"
                y="385.272"
                width="59.7544"
                height="541.607"
                rx="2"
                transform="rotate(-128.7 -188.201 385.272)"
                fill="url(#paint1_linear_93:235)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_93:235"
                  x1="-90.1184"
                  y1="420.414"
                  x2="-90.1184"
                  y2="1131.65"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_93:235"
                  x1="-159.441"
                  y1="204.714"
                  x2="-159.441"
                  y2="915.952"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </section>
      </div>

    );
  }
}
