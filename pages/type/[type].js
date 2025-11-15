import React, { useContext, useState } from 'react'
import { useRouter } from "next/router";
import { Api } from '@/services/service';
import { userContext } from '../_app';

function Type(props) {
    const router = useRouter();
    const [addStaffAndTechnicianData, setAddStaffAndTechnicianData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    })
    const [user, setUser] = useContext(userContext)

    const register = async (e) => {
        e.preventDefault();

        const data = {
            name: addStaffAndTechnicianData?.name,
            email: addStaffAndTechnicianData?.email,
            phone: addStaffAndTechnicianData?.phone,
            password: addStaffAndTechnicianData?.password,
            role: router?.query?.type,
            organization: user?.id
        }

        // props.loader(true);
        console.log(data);
        
        Api("post", 'auth/register', data, router).then(
            (res) => {
                props.loader(false);
                if (res.status) {
                    setAddStaffAndTechnicianData({
                        name: "",
                        email: "",
                        phone: "",
                        password: "",
                    })
                    if (router?.query?.type === 'guard') {
                        router.push("/officers");
                    }
                    if (router?.query?.type === 'tech') {
                        router.push("/technician");
                    }
                    props.toaster({ type: "success", message: res.data?.message });
                }
                else {
                    props.toaster({ type: "error", message: res?.data?.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <form className='md:px-5 px-5 pb-5 bg-white h-full w-full border border-[#00000050] rounded-[16px] boxShadow' onSubmit={register}>
                <div className='grid md:grid-cols-2 grid-cols-1 w-full md:gap-5 gap-5'>
                    <div className='pt-5 w-full'>
                        <p className='text-[var(--custom-black)] text-base font-normal pb-1'>Name</p>
                        <input className='bg-transparent w-full md:h-[46px] h-[40px] px-5 border border-[var(--custom-black)]  rounded-[10px] outline-none text-[var(--custom-black)] text-base font-normal' type='text' placeholder='Name'
                            value={addStaffAndTechnicianData.name}
                            onChange={((e) => {
                                setAddStaffAndTechnicianData({ ...addStaffAndTechnicianData, name: e.target.value })
                            })}
                            required
                        />
                    </div>

                    <div className='md:pt-5 w-full'>
                        <p className='text-[var(--custom-black)] text-base font-normal pb-1'>Email</p>
                        <input className='bg-transparent w-full md:h-[46px] h-[40px] px-5 border border-[var(--custom-black)]  rounded-[10px] outline-none text-[var(--custom-black)] text-base font-normal' type='email' placeholder='Email'
                            value={addStaffAndTechnicianData.email}
                            onChange={((e) => {
                                setAddStaffAndTechnicianData({ ...addStaffAndTechnicianData, email: e.target.value })
                            })}
                            required
                        />
                    </div>

                    <div className='w-full'>
                        <p className='text-[var(--custom-black)] text-base font-normal pb-1'>Phone</p>
                        <input className='bg-transparent w-full md:h-[46px] h-[40px] px-5 border border-[var(--custom-black)]  rounded-[10px] outline-none text-[var(--custom-black)] text-base font-normal' type='number' placeholder='Phone'
                            value={addStaffAndTechnicianData.phone}
                            onChange={((e) => {
                                setAddStaffAndTechnicianData({ ...addStaffAndTechnicianData, phone: e.target.value })
                            })}
                            required
                        />
                    </div>

                    <div className='w-full'>
                        <p className='text-[var(--custom-black)] text-base font-normal pb-1'>Password</p>
                        <input className='bg-transparent w-full md:h-[46px] h-[40px] px-5 border border-[var(--custom-black)]  rounded-[10px] outline-none text-[var(--custom-black)] text-base font-normal' type='password' placeholder='Password'
                            value={addStaffAndTechnicianData.password}
                            onChange={((e) => {
                                setAddStaffAndTechnicianData({ ...addStaffAndTechnicianData, password: e.target.value })
                            })}
                            required
                        />
                    </div>
                </div>

                <div className='w-full flex justify-center items-center mt-5 '>
                    <button className='bg-black  md:h-[50px] h-[40px] md:w-[188px] w-full rounded-[5px] md:text-xl text-base text-white font-normal' type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Type
