import { StyleSheet, Text } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";

interface FieldLabelProps {
  label: string;
  required?: boolean;
  optional?: boolean;
}

export function FieldLabel({ label, required, optional }: FieldLabelProps) {
  const t = useOrganizerTheme();
  return (
    <Text style={[styles.label, { color: t.text }]}>
      {label}
      {required && <Text style={{ color: t.danger }}> *</Text>}
      {optional && (
        <Text style={[styles.optional, { color: t.textMuted }]}>
          {" "}
          · optional
        </Text>
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 17, fontWeight: "700", marginTop: 20, marginBottom: 8 },
  optional: { fontWeight: "400" },
});
