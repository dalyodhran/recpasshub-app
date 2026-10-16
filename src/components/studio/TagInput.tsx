import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Add a tag...",
}: TagInputProps) {
  const t = useOrganizerTheme();
  const [draft, setDraft] = useState("");

  const commit = () => {
    const tag = draft.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setDraft("");
  };

  return (
    <View
      style={[
        styles.box,
        { backgroundColor: t.surface, borderColor: t.border },
      ]}
    >
      {tags.map((tag) => (
        <View key={tag} style={[styles.chip, { backgroundColor: t.chip }]}>
          <Text style={[styles.chipText, { color: t.text }]}>{tag}</Text>
          <Pressable
            hitSlop={8}
            onPress={() => onChange(tags.filter((x) => x !== tag))}
            accessibilityLabel={`Remove ${tag}`}
          >
            <MaterialIcons name="close" size={18} color={t.textMuted} />
          </Pressable>
        </View>
      ))}
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={commit}
        onBlur={commit}
        blurOnSubmit={false}
        placeholder={placeholder}
        placeholderTextColor={t.placeholder}
        returnKeyType="done"
        style={[styles.input, { color: t.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: { fontSize: 16, fontWeight: "600" },
  input: { flex: 1, minWidth: 100, fontSize: 17, paddingVertical: 6 },
});
