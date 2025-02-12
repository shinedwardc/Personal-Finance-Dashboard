import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dispatch, SetStateAction } from "react"
import { GoogleLogin } from "@react-oauth/google"

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  onLoginFormSubmit,
  onGoogleLogin,
  error,
}: {
  username: string,
  password: string,
  setUsername: Dispatch<SetStateAction<string>>,
  setPassword: Dispatch<SetStateAction<string>>,
  onLoginFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  onGoogleLogin: (credentialResponse: any) => void,
  error: string,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username or email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLoginFormSubmit}>
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
                  <a
                    href="/recover"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required />
              </div>
              <p className="text-red-600">{error}</p>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <GoogleLogin
                onSuccess={(credentialResponse) => onGoogleLogin(credentialResponse)}
                onError={() => {
                  console.log('Login Failed');
                }}
                useOneTap
                ux_mode="popup"
              />
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{""}
              <a
                className="pl-1 hover:underline"
                href="/signup"
              >
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm;
