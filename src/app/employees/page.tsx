"use client"

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { HiStatusOnline, HiStatusOffline } from "react-icons/hi";


export default function Home() {

    const [switcher, setSwitcher] = useState(false);
    const [openModel, setOpenModel] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    return (
        <>
            {!showProfile && (
                <section className="p-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="w-full md:w-[300px] bg-white rounded-lg p-4 flex gap-2 relative cursor-pointer hover:bg-zinc-50" onClick={() => setShowProfile(true)}>
                        <div className="rounded-full p-6 bg-slate-200 text-2xl text-slate-600">
                            <FaUser />
                        </div>
                        <div>
                            <p className="text-2xl font-adlm text-red-500 w-full ps-2">Prabesh</p>
                            <p className="text-md ps-2 text-grey font-adlm">9042127018</p>
                        </div>

                        <div className="flex">
                            {switcher && (
                                <p></p>
                            )}
                            <button className={`border-0 p-2 aspect-square rounded-full text-2xl absolute right-2 bottom-2 bg-white ${switcher ? 'text-green-500 bg-green-200 bg-opacity-40' : 'text-grey'}`} onClick={(e) => { e.stopPropagation(); setSwitcher(!switcher) }}>
                                {switcher ? (<HiStatusOnline />) : (<HiStatusOffline />)}
                            </button>
                        </div>
                    </div>
                </section>
            )}

            <Modal dismissible show={openModel} size={'lg'} onClose={() => setOpenModel(false)}>
                <Modal.Header>Small modal</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6 p-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                            companies around the world are updating their terms of service agreements to comply.
                        </p>
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
                            to ensure a common set of data rights in the European Union. It requires organizations to notify users as
                            soon as possible of high-risk data breaches that could personally affect them.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setOpenModel(false)}>I accept</Button>
                    <Button color="gray" onClick={() => setOpenModel(false)}>
                        Decline
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}