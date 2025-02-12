import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignupForm from "./SignupForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/signup/", {
        username,
        password,
        email,
        monthlyBudget,
      });
      if (response.status === 201) {
        toast.success("Sign up successful!", {
          position: "top-center",
          autoClose: 5000,
        })
        navigate("/login", { state: { success: true } });
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm username={username}
                    email={email}
                    password={password}
                    confirmPassword={confirmPassword}
                    monthlyBudget={monthlyBudget}
                    setUsername={setUsername}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    setConfirmPassword={setConfirmPassword}
                    setMonthlyBudget={setMonthlyBudget}
                    onSignupFormSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
};

export default Signup;
