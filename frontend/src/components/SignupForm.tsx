import { Dispatch, SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const SignupForm = ({
  username,
  email,
  password,
  confirmPassword,
  monthlyBudget,
  setUsername,
  setEmail,
  setPassword,
  setConfirmPassword,
  setMonthlyBudget,
  onSignupFormSubmit,
}: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  monthlyBudget: number | null;
  setUsername: Dispatch<SetStateAction<string>>;
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  setMonthlyBudget: Dispatch<SetStateAction<number | null>>;
  onSignupFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden w-[443.25px]">
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Fill in form below to sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSignupFormSubmit}>
            <div className="mb-2">
              <Label className="block text-sm font-medium">Username *</Label>
              <Input
                type="text"
                value={username}
                required={true}
                className="border border-gray-300"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <Label className="block text-sm font-medium">Email *</Label>
              <Input
                type="email"
                value={email}
                required={true}
                className="border border-gray-300"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <Label className="block text-sm font-medium">Password *</Label>
              <Input
                type="password"
                minLength={2}
                maxLength={16}
                required={true}
                value={password}
                className="border border-gray-300"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <Label className="block text-sm font-medium">
                Re-type password *
              </Label>
              <Input
                type="password"
                minLength={2}
                maxLength={16}
                required={true}
                value={confirmPassword}
                className="border border-gray-300"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium">
                Monthly budget{" "}
              </Label>
              <Input
                type="number"
                required={false}
                value={monthlyBudget !== null ? monthlyBudget : ""}
                className="border border-gray-300"
                onChange={(e) =>
                  setMonthlyBudget(
                    e.target.value === "" ? null : parseInt(e.target.value),
                  )
                }
              />
            </div>
            <Button className="mt-3 text-white bg-green-400 rounded-lg">
              Sign up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;
