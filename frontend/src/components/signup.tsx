import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/api/user";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { errorUtil } from "node_modules/zod/dist/types/v3/helpers/errorUtil";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);

  const [alreadyExists, setAlreadyExists] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const response = await signup(username,password,email,monthlyBudget); 
      console.log(response);
      if (response?.status === 201) {
        setAlreadyExists(null);
        toast.success("Sign up successful!", {
          position: "top-center",
          autoClose: 5000,
        });
        navigate("/login", { state: { success: true } });
      }
    } catch (error : any) {
      if (error.response?.status === 400 && error.response?.data.error === "Username or Email already exists"){
        console.log('Already exists');
        setAlreadyExists("Username/email already exists. Please try again.")
      }
      else {
        toast.error("Sign up failed. Please try again.", {
          position: "top-center",
          autoClose: 5000,
        })
      }
      console.error(error);
    }
  };

  return (
    <div className="flex w-1/2 min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>Fill in form below to sign up</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label className="block text-sm font-medium">Username *</Label>
                  <Input
                    type="text"
                    value={username}
                    required={true}
                    className="border border-gray-300"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="block text-sm font-medium">Email *</Label>
                  <Input
                    type="email"
                    value={email}
                    required={true}
                    className="border border-gray-300"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
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
                <div className="grid gap-2">
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
                <div className="grid gap-2">
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
              </div>
            </form>
          </CardContent>
        </Card>
        <p className="mt-2 text-red-500">{alreadyExists}</p>
      </div>
    </div>
  );
};

export default Signup;
