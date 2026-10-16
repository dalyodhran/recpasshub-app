import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";

interface PickerFieldProps {
  mode: "date" | "time";
  value: Date | null;
  onChange: (value: Date) => void;
  icon: keyof typeof MaterialIcons.glyphMap;
  placeholder: string;
  format: (value: Date) => string;
}

// Generic native date/time field. Android opens the system dialog; iOS shows
// an inline spinner under the field with a Done button.
export function PickerField({
  mode,
  value,
  onChange,
  icon,
  placeholder,
  format,
}: PickerFieldProps) {
  const t = useOrganizerTheme();
  const [iosOpen, setIosOpen] = useState(false);
  // The iOS spinner only fires onChange when the value changes, so keep the
  // shown value here and commit it on Done (covers "pick today and press Done").
  const [pending, setPending] = useState<Date>(() => value ?? new Date());

  const done = () => {
    onChange(pending);
    setIosOpen(false);
  };

  const open = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: value ?? new Date(),
        mode,
        onChange: (_: DateTimePickerEvent, d?: Date) => d && onChange(d),
      });
    } else if (iosOpen) {
      done();
    } else {
      setPending(value ?? new Date());
      setIosOpen(true);
    }
  };

  return (
    <View>
      <Pressable
        onPress={open}
        style={[
          styles.field,
          { backgroundColor: t.surface, borderColor: t.border },
        ]}
      >
        <MaterialIcons name={icon} size={22} color={t.textMuted} />
        <Text
          style={[styles.text, { color: value ? t.text : t.placeholder }]}
          numberOfLines={1}
        >
          {value ? format(value) : placeholder}
        </Text>
      </Pressable>
      {Platform.OS === "ios" && iosOpen && (
        <View
          style={[
            styles.sheet,
            { backgroundColor: t.surface, borderColor: t.border },
          ]}
        >
          <DateTimePicker
            value={pending}
            mode={mode}
            display="spinner"
            onChange={(_, d) => d && setPending(d)}
          />
          <Pressable onPress={done} style={styles.done}>
            <Text
              style={{ color: t.primaryDark, fontWeight: "700", fontSize: 17 }}
            >
              Done
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  text: { flex: 1, fontSize: 18 },
  sheet: { marginTop: 8, borderWidth: 1, borderRadius: 14, paddingBottom: 8 },
  done: { alignSelf: "flex-end", paddingHorizontal: 16, paddingVertical: 8 },
});
