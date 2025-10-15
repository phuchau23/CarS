"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Car } from "lucide-react";
import { useApp } from "@/app/components/providers/app-provider";

import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { loginGuest } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - in real app would validate credentials
    loginGuest();
    router.push("/mobile/home");
  };

  const handleGuestLogin = () => {
    loginGuest();
    router.push("/mobile/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
            <Car className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Xe Của Bạn</CardTitle>
            <CardDescription className="text-base mt-2">
              Quản lý xe thông minh, bảo dưỡng đúng hạn
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 h-11"
            >
              Đăng nhập
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              HOẶC
            </span>
          </div>

          <Button
            variant="outline"
            onClick={handleGuestLogin}
            className="w-full h-11 border-border bg-transparent"
          >
            Tiếp tục với tư cách khách
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <button className="text-primary hover:underline font-medium">
              Đăng ký ngay
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
