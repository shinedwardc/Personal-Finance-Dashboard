import { useState } from "react";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { 
  Select,
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { BudgetSettings, DisplaySettings } from "../interfaces/settings";
import { ChevronRight } from "lucide-react";

const Settings = () => {
  const { handleSettingsForm, userSettings } = useSettingsContext();

  const [view, setView] = useState<string>("Display");

  const budgetForm = useForm<BudgetSettings>({
    defaultValues: { 
      monthly_budget: userSettings.monthly_budget ?? 0,
      over_spending_threshold: userSettings.over_spending_threshold ?? 0.8,
    },
  });

  const displayForm = useForm<DisplaySettings>({
    defaultValues: {
      display_currency: userSettings.display_currency ?? "usd",
      display_date_format: userSettings.display_date_format ?? "US Format MM/DD/YYYY",
      default_dashboard_range: userSettings.default_dashboard_range ?? "Current Month",
      notifications_enabled: userSettings.notifications_enabled ?? false,
      income_affects_budget: userSettings.income_affects_budget ?? false,
      income_ratio_for_budget: userSettings.income_ratio_for_budget ?? 50,
    }
  });

  const incomeAffectsBudget = displayForm.watch("income_affects_budget");

  const onSubmitBudget: SubmitHandler<BudgetSettings> = (data) => {
    handleSettingsForm({ kind: "budget", ...data });
  };

  const onSubmitDisplay: SubmitHandler<DisplaySettings> = (data) => {
    handleSettingsForm({ kind: "display", ...data });
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
                {view === "Display" && <ChevronRight size={16} />}
              </span>
              <button onClick={() => setView("Display")} className="hover:underline hover:underline-offset-2">Display</button>
            </li>
            <li className="mb-2 flex items-center">
              <span className="w-4 mr-1 flex justify-center">
                {view === "Budget" && <ChevronRight size={16} />}
              </span>
              <button onClick={() => setView("Budget")} className="hover:underline hover:underline-offset-2">Budget and spending controls</button>
            </li>
          </ul>
          <div className="w-2/3">
            <div className="mb-2">
              <p className="text-md font-bold">{view}</p>
            </div>
            {view === "Display" && (
              <div className="my-2">
                <form onSubmit={displayForm.handleSubmit(onSubmitDisplay)}>
                  <div className="flex flex-col w-1/2 gap-y-1">
                    <label className="my-4 text-sm font-medium leading-none">
                      Default display currency
                    </label>
                    <Controller
                      control={displayForm.control}
                      name="display_currency"
                      render={({ field }) => (
                        <Select
                          value={field.value !== undefined ? String(field.value) : ""}
                          onValueChange={(curr) => field.onChange(curr)}
                        >
                          <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {[        
                              "usd",
                              "eur",
                              "gbp",
                              "jpy",
                              "aud",
                              "cad",
                              "krw",
                              "inr"
                            ].map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="flex flex-col w-1/2 gap-y-1">
                    <label className="my-4 text-sm font-medium leading-none">
                      Date format
                    </label>
                    <Controller
                      control={displayForm.control}
                      name="display_date_format"
                      render={({ field }) => (
                        <Select
                          value={field.value !== undefined ? String(field.value) : ""}
                          onValueChange={(curr) => field.onChange(curr)}
                        >
                          <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            {[        
                              "MM/DD/YYYY",
                              "DD/MM/YYYY",
                              "YYYY/MM/DD",
                            ].map((format) => (
                              <SelectItem key={format} value={format}>
                                {format}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />                       
                  </div>
                  {/*<div className="flex flex-col w-1/2 gap-y-1">
                    <label className="my-4 text-sm font-medium leading-none">
                      Dashboard analyctics date range
                    </label>
                    <Controller
                      control={displayForm.control}
                      name="default_dashboard_range"
                      render={({ field }) => (
                        <Select
                          value={field.value !== undefined ? String(field.value) : ""}
                          onValueChange={(curr) => field.onChange(curr)}
                        >
                          <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            {[        
                              "Current Month",
                              "30 days",
                              "Quarter",
                              "Year",
                              "All",
                            ].map((date) => (
                              <SelectItem key={date} value={date}>
                                {date}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />                       
                  </div>*/}
                  <div className="flex items-center w-1/2 my-4 gap-x-2">
                    <Controller
                      control={displayForm.control}
                      name="income_affects_budget"
                      render={({ field }) => (
                        <Checkbox
                          id="income_affects_budget"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <label 
                      htmlFor="income_affects_budget"
                      className="text-sm font-medium leading-none flex flex-col">
                      Auto-adjust budget based on this month’s income
                      <span className="text-muted-foreground text-xs">
                        Your limit will change based on the month's income amount
                      </span>
                    </label>                       
                  </div>   
                  <div className="relative w-1/2 mt-2 h-12">
                    {incomeAffectsBudget && (
                      <div className="flex flex-col mb-4 w-full gap-y-2">
                        <label
                          htmlFor="income_ratio_for_budget"
                          className="w-full text-sm font-medium leading-none"
                        >
                          Set budget to % of income
                        </label>
                        <Controller
                          control={displayForm.control}
                          name="income_ratio_for_budget"
                          render={({ field }) => (
                            <div className="flex flex-col gap-1 flex-1">
                              <Slider
                                className="w-4/5"
                                min={0}
                                max={100}
                                step={1}
                                value={[field.value ?? 0]}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                              <span className="text-sm text-muted-foreground">
                                {field.value ?? 0}%
                              </span>
                            </div>
                          )}
                        />
                      </div>
                    )}  
                  </div>                            
                  <div className="flex flex-col mt-4 w-1/2">
                    <input
                      className="w-1/2 btn btn-accent"
                      type="submit"
                      value="Save changes"
                    />
                  </div>
                </form>                
              </div>
            )}
            {view === "Budget" && (
              <div className="my-2">
                <form className="" onSubmit={budgetForm.handleSubmit(onSubmitBudget)}>
                  <div className="flex flex-col w-1/2 gap-y-1">
                    <span className="label-text text-base">
                      Monthly limit ({userSettings.display_currency?.toUpperCase()})
                    </span>
                    <input
                      className="w-1/2 p-2 border rounded-md transition-colors
                              disabled:bg-slate-100 disabled:text-slate-500 
                                disabled:cursor-not-allowed disabled:opacity-70 
                              disabled:border-slate-200"
                      {...budgetForm.register("monthly_budget", { valueAsNumber: true })}
                      type="number"
                      placeholder="Enter number"
                      disabled={userSettings.income_affects_budget}
                    />                        
                  </div>
                  <div className="flex flex-col mt-4 w-1/2">
                    <span className="label-text text-base">
                      Overspending threshold
                    </span>
                    <Controller
                      control={budgetForm.control}
                      name="over_spending_threshold"
                      render={({ field }) => (
                        <Select
                          value={field.value !== undefined ? String(field.value) : ""}
                          onValueChange={(v) => field.onChange(Number(v))}
                        >
                          <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Select threshold" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0.8, 1.0, 1.2].map((threshold) => (
                              <SelectItem key={threshold} value={String(threshold)}>
                                {Number(threshold) * 100}%
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>                  
                  <div className="flex flex-col mt-4 w-1/2">
                    <input
                      className="w-1/2 btn btn-accent"
                      type="submit"
                      value="Save changes"
                    />
                  </div>
                </form>
              </div>
            )}
            {/*view === "Connections" && (
              <>
                <div className="my-2">
                  <Connections />
                </div>
              </>
            )*/}
          </div>
          </div>
      </div>
    </>
  );
};

export default Settings;
