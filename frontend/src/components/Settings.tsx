import { useState } from "react";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { BudgetSettings, DisplaySettings } from "../interfaces/settings";
import Connections from "./Connections";
import { ChevronRight } from "lucide-react";

const Settings = () => {
  const { handleSettingsForm } = useSettingsContext();

  const [view, setView] = useState<string>("Profile");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BudgetSettings>();

  const onSubmit: SubmitHandler<BudgetSettings> = (data: BudgetSettings) => {
    handleSettingsForm(data);
  };

  return (
    <>
      <div className="min-h-[calc(95vh-6rem)] my-6 w-full px-32 py-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
        <div className="my-2">
          <h1 className="text-3xl font-semibold antialiased dark:text-white">
            Settings
          </h1>
        </div>
        <div className="mt-8 flex flex-row">
          <ul className="flex flex-col h-full text-md w-1/3 gap-y-2">
            <li className="mb-2 flex items-center">
              <span className="w-4 mr-1 flex justify-center">
                {view === "Profile" && <ChevronRight size={16} />}
              </span>
              <button onClick={() => setView("Profile")} className="hover:underline hover:underline-offset-2">Personal info</button>
            </li>
            <li className="mb-2 flex items-center">
              <span className="w-4 mr-1 flex justify-center">
                {view === "Budget" && <ChevronRight size={16} />}
              </span>
              <button onClick={() => setView("Budget")} className="hover:underline hover:underline-offset-2">Budget and spending controls</button>
            </li>
            <li className="mb-2 flex items-center">
              <span className="w-4 mr-1 flex justify-center">
                {view === "Connections" && <ChevronRight size={16} />}
              </span>
              <button onClick={() => setView("Connections")} className="hover:underline hover:underline-offset-2">Connections</button>
            </li>
          </ul>
          <div className="w-2/3">
            <div className="mb-2">
              <p className="text-md font-bold">{view}</p>
            </div>
            {view === "Profile" && (
              <>

              </>
            )}
            {view === "Budget" && (
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
                      />
                    </div>
                  </form>
                </div>
              </>
            )}
            {view === "Connections" && (
              <>
                <div className="my-2">
                  <Connections />
                </div>
              </>
            )}
          </div>
          </div>
      </div>
    </>
  );
};

export default Settings;
