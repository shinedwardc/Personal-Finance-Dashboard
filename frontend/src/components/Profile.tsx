import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

const Profile = ({ onFormSubmit}) => {

    const [view, setView] = useState<string>("Profile");
    const [data, setData] = useState<Inputs>({monthlyLimit: 0});

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
        setData(data);
        onFormSubmit(data);
    }

    return (
        <>
        <div className="flex w-1/2 flex-row p-4 bg-green-600 gap-x-4 h-64">
            <div className="pr-4">
                <ul className="text-center flex flex-col h-full">
                    <li className="font-bold text-4xl mb-2">Settings</li>
                    <li className="hover:bg-slate-400 rounded-full p-2 mb-1" onClick={() => setView("Profile")}>Account settings</li>
                    <li className="hover:bg-slate-400 rounded-full p-1 mb-1" onClick={() => setView("Notifications")}>Notifications</li>
                </ul>
            </div>
            <div className="w-[2px] bg-gray-800"></div>
            <div className="w-full p-4">
                <div className="mb-2">
                    <p className="text-bold text-2xl">{view}</p>
                </div>
                {view === "Profile" &&     
                <>            
                <div className="my-2">
                    <form className="" onSubmit={handleSubmit(onSubmit)}>
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">Monthly limit</span>
                            </div>
                            <input className="w-48 p-2" {...register("monthlyLimit", { required: true })} type="number" placeholder="Enter number" />
                        </label>
                        <div className="flex justify-center mt-2 w-1/2">
                            <input className="btn btn-accent" type="submit" value="Submit"/>
                        </div>
                    </form>
                </div>
                <div>
                    {data.monthlyLimit}$
                </div>
                </>
                }
            </div>
        </div>
        </>
    )
};

export default Profile;