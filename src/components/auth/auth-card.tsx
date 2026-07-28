import { ThemedView } from "@/components/ui/themed-view";
import { authStyles } from "@/styles/auth.styles";
import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return <ThemedView style={authStyles.cardContainer}>{children}</ThemedView>;
};
