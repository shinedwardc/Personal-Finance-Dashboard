import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import { loginUser, googleLogin } from "@/api/user";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { authState, setAuthState } = useSettingsContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      setAuthState({
        isLoggedIn: true,
        isPlaidConnected: authState.isPlaidConnected,
        isLoading: false,
      });
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username/email or password");
      console.error(error);
    }
  };

  const handleGoogleLogin = async (request: any) => {
    console.log("request", request);
    try {
      await googleLogin(request.credential);
      setAuthState({
        isLoggedIn: true,
        isPlaidConnected: authState.isPlaidConnected,
        isLoading: false,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your username or email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Username/Email</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johnsmith@example.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      {/*<a
                        href="/recover"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>*/}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-red-600">{error}</p>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <GoogleLogin
                    onSuccess={(credentialResponse) =>
                      handleGoogleLogin(credentialResponse)
                    }
                    onError={() => {
                      console.log("Login Failed");
                    }}
                    useOneTap
                    ux_mode="popup"
                  />
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{""}
                  <a className="pl-1 hover:underline" href="/signup">
                    Sign up
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
