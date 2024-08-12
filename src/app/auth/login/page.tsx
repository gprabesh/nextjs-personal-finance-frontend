"use client";
import Link from "next/link";
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
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import http from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";
import { LoginResponse } from "./login";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  usernameOrEmail: z.string().min(3),
  password: z.string().min(8).max(16),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  let {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) });

  const router = useRouter();

  const onSubmit: SubmitHandler<LoginSchemaType> = (data) => {
    http
      .post("/api/auth/login", data)
      .then((response: AxiosResponse) => {
        const loginResponse: LoginResponse = response.data;
        if (loginResponse.user) {
          sessionStorage.setItem(
            "currentUser",
            JSON.stringify(loginResponse.user)
          );
          sessionStorage.setItem(
            "accessToken",
            JSON.stringify(loginResponse.token)
          );
        }
      })
      .then(() => router.push("/dashboard"))
      .catch((error: AxiosError) => console.log(error));
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Username/Email</Label>
                <Input
                  id="usernameOrEmail"
                  type="text"
                  placeholder="username / email"
                  required
                  {...register("usernameOrEmail")}
                />
                {errors.usernameOrEmail && (
                  <span className="text-red-500 text-sm">
                    {errors.usernameOrEmail.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  required
                  {...register("password")}
                />
                <div className="items-right">
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
