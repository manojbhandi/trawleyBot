'use client'

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react"
import FomoNotification from "./FomoNotification";
import { SocilaProofNotification } from "@/types/testimonial";
import { getEmailFromUserAnalytics, getLiveSubscriptions } from "@/utils/supabase/queries";

let notificationId: number = 0;
type UserAnalyticsPayload = {
    Row: {
        id: string;
        auth_user_id: string | null;
        stripe_customer_id: string | null;
        full_name: string | null;
        email: string | null;
        phone_number: string | null;
        created_date: string;
    };
};
const RealTimeNotification = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    console.log("Component re-rendered with notifications:11", notifications);
    const getRandomWord = () => {
        const words = ["Sarkar", "Prajapati", "Bai", "Kumari", "Reddy", "Williams"];
        return words[Math.floor(Math.random() * words.length)];
    };
    const getRandoCity = () => {
        const words = ["UAE", "UK", "India", "", "US", "Russia"];
        return words[Math.floor(Math.random() * words.length)];
    };
    useEffect( () => {
        const supabase = createClient();
        const subscription = supabase.channel('subscriptions')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'subscriptions',
            }, async(payload: any) => {
                console.log("Payment Success!!", payload);
                const {products:{name}} = await getLiveSubscriptions(supabase, payload.new.price_id)
                const [{ email }] = await getEmailFromUserAnalytics(supabase, payload.new.user_id)
                console.log("aname", name);
                const newNotification = {
                    id: ++notificationId,
                    message: `${email.split('@')[0]} just subscribed!`,
                    user: email,
                    firstName: email,
                    lastName: "",
                    plan: name,
                    avatrUrl: "event.avatrUrl",
                    location: "event.location"
                };
                
                console.log("New notification:", newNotification);
                setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
                // setNotifications((prevNotifications)=>{
                //     const updatedNotifications = [...prevNotifications, newNotification];
                //     console.log(updatedNotifications, "updatedNotifications")
                //     return updatedNotifications;
                // })

                // setTimeout(() => {
                //              setNotifications((prev) => prev.filter((event) => event.id != newNotification.id))
                // }, 2000)
                

            })
            .subscribe()
        return () => {
            subscription.unsubscribe();
        };



        // const handleNewEvent = (event: any) => {
        //     console.log("Payment Success!!", event);

        //     const newEvent: SocilaProofNotification = {
        //         id: notificationId++,
        //         message: `🚀 ${event.user} just bought the ${event.plan} plan!`,
        //         user: event.user,
        //         firstName: event.firstName,
        //         lastName: event.lastName,
        //         plan: event.plan,
        //         avatrUrl: event.avatrUrl,
        //         location: event.location
        //     };

        //     setNotifications((prevNotifications) => [...prevNotifications, newEvent]);

        //     // setTimeout(() => {
        //     //     setNotifications((prev) => prev.filter((event) => event.id != newEvent.id))
        //     // }, 2000)

        // }

        // const mockRealEvent = () => {
        //     handleNewEvent(
        //         {
        //             user: "Sunita",
        //             plan: "Basic",
        //             firstName: 'Sunita',
        //             lastName: getRandomWord(),
        //             avatarUrl: `demo`,
        //             location: getRandoCity(),

        //         }
        //     );
        // }

        // const interval = setInterval(() => {
        //     mockRealEvent();
        //     if (notificationId > 4) {
        //         clearInterval(interval);
        //     }
        // }, 5000);
        // return () => clearInterval(interval);
    }, [])

    
    useEffect(() => {
        console.log("Component re-rendered with notifications:", notifications);
    }, [notifications]);
    return (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 space-y-4" >
            {
                notifications.length > 0 && notifications.map((notification: SocilaProofNotification) => (
                    <FomoNotification key={notification.id} notification={notification} />
                ))
            }
        </div >
    )

}
export default RealTimeNotification;
