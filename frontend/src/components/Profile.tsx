import { useState } from "react";

const Profile = () => {

    const [view, setView] = useState<string>("accountSettings");

    return (
        <div className="flex w-1/2 flex-row p-4 bg-green-600 gap-x-4">
            <div className="flex justify-center">
                <ul className="text-center space-y-4">
                    <li className="hover:bg-slate-400 rounded-full p-1" onClick={() => setView("accountSettings")}>Account settings</li>
                    <li className="hover:bg-slate-400 rounded-full p-1" onClick={() => setView("notifications")}>Notifications</li>
                </ul>
            </div>
            <div className="w-[2px] h-[200px] bg-gray-800"></div>
            <div>
                {view === "accountSettings" && (
                    <div>
                        <p>Account settings</p>
                    </div>
                )
                }  
            </div>
        </div>
    )
};

export default Profile;