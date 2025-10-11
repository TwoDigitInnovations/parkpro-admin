import React, { useEffect, useState } from 'react'
import isAuth from '@/components/isAuth'
import { Api } from '@/services/service';
import { useRouter } from "next/router";

function Notifications(props) {
    const router = useRouter();
    const [notificationData, setNotificationData] = useState([]);

    useEffect(() => {
        getNotification();
    }, []);

    const getNotification = async () => {
        props.loader(true);
        Api("get", "notification/getNotification", "", router).then(
            (res) => {
                props.loader(false);
                // console.log("res================> form data :: ", res);
                setNotificationData(res.data);
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className='bg-white border border-[#00000050] rounded-[16px] boxShadow p-5 flex flex-col gap-5'>
                {notificationData.map((item, i) => (<div key={i} className='bg-white border border-[#00000025] rounded-[16px] boxShadow p-5'>
                    <p className='text-black text-lg font-semibold pb-2'>{item?.notification_title}</p>
                    <p className='text-black text-base font-normal italic'>{item?.notification_description}</p>
                </div>))}

                {/* <div className='bg-white border border-[#00000025] rounded-[16px] boxShadow p-5'>
                    <p className='text-black text-lg font-semibold pb-2'>🚔 New Report Assigned</p>
                    <p className='text-black text-base font-normal italic'>“RPT-003 (XYZ 789) assigned to Officer Johan.” (Officer: Johan Eriksson) – 23 Sep, 10:45 AM</p>
                </div> */}

                {/* <div className='bg-white border border-[#00000025] rounded-[16px] boxShadow p-5'>
                    <p className='text-black text-lg font-semibold pb-2'>🔧 Machine Issue</p>
                    <p className='text-black text-base font-normal italic'>“Ticket Machine #AE1160 reported broken.” (User: Johan Karlsson) – 23 Sep, 11:05 AM</p>
                </div> */}

                {/* <div className='bg-white border border-[#00000025] rounded-[16px] boxShadow p-5'>
                    <p className='text-black text-lg font-semibold pb-2'>📩 Case Reassigned</p>
                    <p className='text-black text-base font-normal italic'>“RPT-004 reassigned to Officer Sara.” (Officer: Sara Berg) – 23 Sep, 11:20 AM</p>
                </div> */}
            </div>
        </div>
    )
}

export default isAuth(Notifications)
