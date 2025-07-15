import React from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { LoginForm } from "../../components/auth/LoginForm";

const LoginPage = () => (
  <AuthLayout>
    <LoginForm />
  </AuthLayout>
);
export default LoginPage;
