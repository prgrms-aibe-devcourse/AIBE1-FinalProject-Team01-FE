import React from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { ResetPasswordForm } from "../../components/auth/ResetPasswordForm";
import "../../styles/components/auth/auth.css";

const ResetPasswordPage = () => (
  <AuthLayout>
    <ResetPasswordForm />
  </AuthLayout>
);

export default ResetPasswordPage;