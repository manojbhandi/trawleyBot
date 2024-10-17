'use client'
import Link from "next/link";
import { useEffect, useRef, useState } from "react"
import './fomoNotification.css'
import { SocilaProofNotification } from "@/types/testimonial";


const FomoNotification = (props: { notification: SocilaProofNotification }) => {
    const { notification } = props;
    // const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])
    // useEffect(() => {

    //     notifications.map((notification: Notification) => {
    //         setVisibleNotifications((prevNotifications) => [notification]);

    //         // setTimeout(() => {
    //         //     setVisibleNotifications((prevNotifications) => prevNotifications.filter((n) => n.id != notification.id));
    //         // }, 2000);
    //     })
    //     // console.log(visibleNotifications,"lenght")
    // }, [notifications])


    return (


        <div
            className="fixed bottom-4 right-4 bg-white text-primary py-3 px-4 animate-slide-up duration-300 transform transition-transform hover:scale-105 rounded-lg  animate-slide-up hover:z-10 slide-up-fade-out"
            style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
        >
            <div className="flex items-center space-x-3">
                <img src={`https://avatar.iran.liara.run/username?username=${notification.firstName + '+' + notification.lastName}`} alt="Random Avatar" className="w-8 h-8 rounded-full" />
                <div className="flex flex-col ">
                    <p className="font-bold">{notification.firstName + " " + notification.lastName}, {notification.location} </p>
                    <p>just bought the {" "}
                        <Link href='/pricing' className="hover:underline">
                            <strong>
                                {notification.plan}
                            </strong>
                        </Link>
                        🚀 plan!
                    </p>
                </div>
            </div>

            {/* })} */}
        </div>
    )
}

export default FomoNotification;