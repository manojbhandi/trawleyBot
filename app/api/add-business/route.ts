import { createClient } from '@/utils/supabase/server';
import { randomUUID } from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

type ResponseData = {
  message?: string;
  error: string | boolean;
};

export async function POST(req: NextRequest) {
  const supabase = createClient();
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const values = await req.json();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();
    console.log(user, 'user');
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unable to fetch user details or user not authenticated' },
        { status: 401 }
      );
    }
    const { data, error: upsertError } = await supabase
      .from('business_entity')
      .upsert({
        id: randomUUID(),
        business_name: values.businessName,
        mobile: values.phoneNumber,
        site_url: values.websiteUrl,
        email: values.emailAddress,
        first_name: values.firstName,
        last_name: values.lastName,
        business_info: values.businessInfo,
        auth_user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    if (upsertError) {
      console.log(upsertError, 'upsertError');
      if (upsertError.code === '23505') {
        return NextResponse.json(
          { error: 'The site URL already exists. Please use a different URL.' },
          { status: 400 } 
        );
      }
      return NextResponse.json(
        { error: `Business Entity Creation Failed: ${upsertError.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: `Business Entity Created Successfully`,
        error: false
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: `Internal Server Error ${e?.message}` },
      { status: 500 }
    );
  }
}
