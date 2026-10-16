import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";

interface FormSectionProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function FormSection({ title, subtitle, children }: FormSectionProps) {
  const t = useOrganizerTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: t.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: t.textMuted }]}>
          {subtitle}
        </Text>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 4 },
  title: { fontSize: 30, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { fontSize: 17, lineHeight: 24, marginBottom: 12 },
});
