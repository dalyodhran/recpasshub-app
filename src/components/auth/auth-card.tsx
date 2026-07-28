import React from "react";
import { ThemedView } from "@/components/themed-view";
import { authStyles } from "@/styles/auth.styles";

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return <ThemedView style={authStyles.cardContainer}>{children}</ThemedView>;
};
