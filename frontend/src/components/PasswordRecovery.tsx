import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PasswordRecovery = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleVerificationRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/reset-password-email/",
        {
          email: email,
        },
      );
      console.log(response.data);
      setEmailSent(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    console.log(code, code.length)
    console.log(email)
    console.log(password)
    if (code.length === 6) {
      try {
        const response = await axios.post("http://localhost:8000/code-verification/", {
          code: code,
          email: email,
          password: password,
        })
        console.log(response.data)
        response.data[0] === "User verified successfully" ? navigate('/login') : console.error('error')
      }
      catch (error) {
        console.error('code verification error: ', error);
        setCodeError("Invalid code")
      }
    }
    else {
      setCodeError("Invalid code");
    }
    setPassword("");
  }

  return (
    <div className="flex items-center justify-center bg-muted p-6">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Forgot password?</CardTitle>
            <CardDescription>
              Enter your email and we will send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={!emailSent ? handleVerificationRequest : handleNewPassword}>
              <div className="flex flex-col gap-6 mb-3">
                {!emailSent ? (
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="code">Verification code</Label>
                    <Input
                      id="code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                    <div className="text-red-600">{codeError}</div>
                    <Label htmlFor="password">New password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
              >
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default PasswordRecovery;
