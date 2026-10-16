import { StyleSheet, Text, View } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";
import { FormSection } from "./FormSection";

interface StepPlaceholderProps {
  title: string;
  subtitle: string;
}

// Stand-in for Event Studio steps that do not have a mockup yet.
export function StepPlaceholder({ title, subtitle }: StepPlaceholderProps) {
  const t = useOrganizerTheme();
  return (
    <FormSection title={title} subtitle={subtitle}>
      <View style={[styles.box, { borderColor: t.border }]}>
        <Text style={{ color: t.textMuted, fontSize: 16 }}>
          This step is being redesigned.
        </Text>
      </View>
    </FormSection>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
  },
});
