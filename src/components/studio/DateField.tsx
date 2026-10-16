import { PickerField } from "./PickerField";

interface DateFieldProps {
  value: Date | null;
  onChange: (value: Date) => void;
}

export function DateField({ value, onChange }: DateFieldProps) {
  return (
    <PickerField
      mode="date"
      icon="calendar-today"
      placeholder="Select a date"
      value={value}
      onChange={onChange}
      format={(d) =>
        d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      }
    />
  );
}
