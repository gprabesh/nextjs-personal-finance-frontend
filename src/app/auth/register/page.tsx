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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import http from "@/lib/axios";
import { AxiosError, AxiosResponse } from "axios";
import { LoginResponse } from "../login/login";
import { useRouter } from "next/navigation";

const RegisterSchema = z
  .object({
    name: z.string().min(3),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8).max(16),
    password_confirmation: z.string().min(8).max(16),
  })
  .refine(
    (values) => {
      return values.password === values.password_confirmation;
    },
    {
      message: "Passwords must match!",
      path: ["password_confirmation"],
    }
  );
type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export default function LoginForm() {
  let {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterSchemaType>({ resolver: zodResolver(RegisterSchema) });
  const router = useRouter();

  const onSubmit: SubmitHandler<RegisterSchemaType> = (data) => {
    http
      .post("/api/auth/register", data)
      .then((response: AxiosResponse) => {
        const registerResponse: LoginResponse = response.data;
        if (registerResponse.user) {
          sessionStorage.setItem(
            "currentUser",
            JSON.stringify(registerResponse.user)
          );
          sessionStorage.setItem(
            "accessToken",
            JSON.stringify(registerResponse.token)
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
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Name</Label>
                <Input
                  id="name"
                  placeholder="Name"
                  required
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  required
                  {...register("username")}
                />
                {errors.username && (
                  <span className="text-red-500 text-sm">
                    {errors.username.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="********"
                  type="password"
                  required
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input
                  id="password-confirmation"
                  placeholder="********"
                  type="password"
                  required
                  {...register("password_confirmation")}
                />
                {errors.password_confirmation && (
                  <span className="text-red-500 text-sm">
                    {errors.password_confirmation.message}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
