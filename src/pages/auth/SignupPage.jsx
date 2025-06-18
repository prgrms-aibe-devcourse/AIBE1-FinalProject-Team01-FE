import React from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { SignupForm } from "../../components/auth/SignupForm";

export const SignupPage = () => (
  <AuthLayout>
    <SignupForm />
  </AuthLayout>
);
