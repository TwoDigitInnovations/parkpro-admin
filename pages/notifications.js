import React from 'react'
import isAuth from '@/components/isAuth'

function Notifications() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className='bg-white border border-[#00000050] rounded-[16px] boxShadow p-5 flex flex-col gap-5'>
                <div className='bg-white border border-[#00000025] rounded-[16px] boxShadow p-5'>
                    <p className='text-black text-lg font-semibold pb-2'>🔔 Report Closed</p>
                    <p className='text-black text-base font-normal italic'>“Your report RPT-001 has been closed by Officer Karl.” (User: Anna Svensson) – 23 Sep, 10:30 AM</p>
                </div>

                <div className='bg-white border border-[#00000025] rounded-[16px] boxShadow p-5'>
                    <p className='text-black text-lg font-semibold pb-2'>🚔 New Report Assigned</p>
                    <p className='text-black text-base font-normal italic'>“RPT-003 (XYZ 789) assigned to Officer Johan.” (Officer: Johan Eriksson) – 23 Sep, 10:45 AM</p>
                </div>

                <div className='bg-white border border-[#00000025] rounded-[16px] boxShadow p-5'>
                    <p className='text-black text-lg font-semibold pb-2'>🔧 Machine Issue</p>
                    <p className='text-black text-base font-normal italic'>“Ticket Machine #AE1160 reported broken.” (User: Johan Karlsson) – 23 Sep, 11:05 AM</p>
                </div>

                <div className='bg-white border border-[#00000025] rounded-[16px] boxShadow p-5'>
                    <p className='text-black text-lg font-semibold pb-2'>📩 Case Reassigned</p>
                    <p className='text-black text-base font-normal italic'>“RPT-004 reassigned to Officer Sara.” (Officer: Sara Berg) – 23 Sep, 11:20 AM</p>
                </div>
            </div>
        </div>
    )
}

export default isAuth(Notifications)
