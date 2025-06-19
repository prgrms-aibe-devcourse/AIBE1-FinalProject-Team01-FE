import React from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { FindPasswordForm } from "../../components/auth/FindPasswordForm";
import "../../styles/components/auth/auth.css";

const FindPasswordPage = () => (
  <AuthLayout>
    <FindPasswordForm />
  </AuthLayout>
);

export default FindPasswordPage;
