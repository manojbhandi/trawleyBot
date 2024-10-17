import { createClient } from '@/utils/supabase/server';
import {
    getUser
} from '@/utils/supabase/queries';
import Navbar from '../Navbar';
import Footer from '../Footer';


const DefaultLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const supabase = createClient();
    const [user] = await Promise.all([
        getUser(supabase)
    ])
    return (
        <div className='flex flex-col'>
            <Navbar user={user} />
            <div className=" w-full flex flex-col mt-20">
                {children}
            </div>
            <Footer/>
        </div>
    );
}
export default DefaultLayout;
