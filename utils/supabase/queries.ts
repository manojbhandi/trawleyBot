import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';
import Stripe from 'stripe';

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

export const getSubscription = async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .single();

  return subscription;
};

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });
  return products;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  return userDetails;
});

export const getLiveSubscriptions = cache(
  async (
    supabase: SupabaseClient,
    priceId: string,
  ) => {
    const { data, error }: any = await supabase
      .from('prices')
      .select(
        `products(name)`
      )
      .eq('id', priceId)
      .single();
    if (error) {
      console.error('Error fetching live subscriptions:', error);
    }
    return data;
  }
);


export const getEmailFromUserAnalytics = cache(
  async (
    supabase: SupabaseClient,
    userId: string,
  ) => {
    const { data, error }: any = await supabase
      .from('user_analytics')
      .select(
        `email`
      )
      .eq('authUserId', userId)
      .limit(1);
    if (error) {
      console.error('Error fetching email:', error);
    }
    return data;
  }
);
