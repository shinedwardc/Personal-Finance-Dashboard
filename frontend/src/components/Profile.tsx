import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Settings } from "../interfaces/interface";
import Connections from "./Connections";

const Profile = ({
  settings,
  isLoading,
  onFormSubmit,
}: {
  settings: Settings;
  isLoading: boolean;
  onFormSubmit: (data: Settings) => void;
}) => {
  const [view, setView] = useState<string>("Profile");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Settings>();

  const onSubmit: SubmitHandler<Settings> = (data: Settings) => {
    onFormSubmit(data);
  };

  return (
    <>
      <div className="flex w-1/2 flex-row p-4 bg-green-600 gap-x-2 h-86 mt-16 rounded-xl">
        <div className="pr-4">
          <ul className="text-center flex flex-col h-full">
            <li className="font-bold text-4xl mb-2">Settings</li>
            <li
              className="rounded-full p-2 mb-1"
              onClick={() => setView("Profile")}
            >
              <button className="btn btn-accent">Account settings</button>
            </li>
            <li
              className="rounded-full p-1 mb-1"
              onClick={() => setView("Connections")}
            >
              <button className="btn btn-accent">Connections</button>
            </li>
          </ul>
        </div>
        <div className="p-0.5 bg-gray-800"></div>
        <div className="w-full p-4">
          <div className="mb-2">
            <p className="text-bold text-2xl">{view}</p>
          </div>
          {view === "Profile" && (
            <>
              <div className="my-2">
                <form className="" onSubmit={handleSubmit(onSubmit)}>
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text text-base">
                        Monthly limit ($)
                      </span>
                    </div>
                    <input
                      className="w-48 p-2"
                      {...register("monthlyBudget", { required: true })}
                      type="number"
                      placeholder="Enter number"
                    />
                  </label>
                  <div className="flex justify-center mt-2 w-1/2">
                    <input
                      className="btn btn-accent"
                      type="submit"
                      value="Submit"
                      onClick={() => console.log('submitted')}
                    />
                  </div>
                </form>
              </div>
            </>
          )}
          {
            view === "Connections" && (
              <>
                <div className="my-2">
                  <Connections />
                </div>
              </>
            )
          }
        </div>
      </div>
    </>
  );
};

export default Profile;
