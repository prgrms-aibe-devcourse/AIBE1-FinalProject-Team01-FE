import React from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { LoginForm } from "../../components/auth/LoginForm";

export const LoginPage = () => (
  <AuthLayout>
    <LoginForm />
  </AuthLayout>
);
