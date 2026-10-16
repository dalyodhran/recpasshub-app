import { MaterialIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";

type Action = "bold" | "italic" | "list" | "link";

const TOOLS: { action: Action; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { action: "bold", icon: "format-bold" },
  { action: "italic", icon: "format-italic" },
  { action: "list", icon: "format-list-bulleted" },
  { action: "link", icon: "link" },
];

// Applies a Markdown action to the selected range of `text`.
export function applyMarkdown(
  text: string,
  start: number,
  end: number,
  action: Action,
): { text: string; selection: { start: number; end: number } } {
  const selected = text.slice(start, end);
  const before = text.slice(0, start);
  const after = text.slice(end);

  const wrap = (open: string, close: string, fallback: string) => {
    const inner = selected || fallback;
    return {
      text: `${before}${open}${inner}${close}${after}`,
      selection: {
        start: start + open.length,
        end: start + open.length + inner.length,
      },
    };
  };

  switch (action) {
    case "bold":
      return wrap("**", "**", "bold text");
    case "italic":
      return wrap("_", "_", "italic text");
    case "link":
      return wrap("[", "](https://)", "link text");
    case "list": {
      const lineStart = before.lastIndexOf("\n") + 1;
      const block = text.slice(lineStart, end) || "";
      const prefixed = (block || "item")
        .split("\n")
        .map((l) => `- ${l}`)
        .join("\n");
      const next = `${text.slice(0, lineStart)}${prefixed}${after}`;
      const pos = lineStart + prefixed.length;
      return { text: next, selection: { start: pos, end: pos } };
    }
  }
}

interface RichTextFieldProps extends Omit<
  TextInputProps,
  "value" | "onChangeText" | "multiline"
> {
  value: string;
  onChangeText: (value: string) => void;
}

// Plain TextInput with a toolbar that inserts Markdown; stored as text.
export function RichTextField({
  value,
  onChangeText,
  style,
  ...props
}: RichTextFieldProps) {
  const t = useOrganizerTheme();
  const inputRef = useRef<TextInput>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const run = (action: Action) => {
    const result = applyMarkdown(value, selection.start, selection.end, action);
    onChangeText(result.text);
    setSelection(result.selection);
    inputRef.current?.focus();
  };

  return (
    <View
      style={[
        styles.box,
        { backgroundColor: t.surface, borderColor: t.border },
      ]}
    >
      <View style={[styles.toolbar, { borderBottomColor: t.border }]}>
        {TOOLS.map(({ action, icon }) => (
          <Pressable
            key={action}
            onPress={() => run(action)}
            hitSlop={6}
            accessibilityLabel={`Format ${action}`}
            style={styles.tool}
          >
            <MaterialIcons name={icon} size={24} color={t.textMuted} />
          </Pressable>
        ))}
      </View>
      <TextInput
        ref={inputRef}
        multiline
        textAlignVertical="top"
        placeholderTextColor={t.placeholder}
        {...props}
        value={value}
        onChangeText={onChangeText}
        selection={selection}
        onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
        style={[styles.input, { color: t.text }, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: 14, overflow: "hidden" },
  toolbar: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tool: { padding: 2 },
  input: { minHeight: 140, padding: 16, fontSize: 18, lineHeight: 26 },
});
