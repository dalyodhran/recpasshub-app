import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";

export function TextField({ style, ...props }: TextInputProps) {
  const t = useOrganizerTheme();
  return (
    <TextInput
      placeholderTextColor={t.placeholder}
      {...props}
      style={[
        styles.input,
        { backgroundColor: t.surface, borderColor: t.border, color: t.text },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 18,
  },
});
