import { PickerField } from "./PickerField";

interface TimeFieldProps {
  value: Date | null;
  onChange: (value: Date) => void;
}

export function TimeField({ value, onChange }: TimeFieldProps) {
  return (
    <PickerField
      mode="time"
      icon="schedule"
      placeholder="Select time"
      value={value}
      onChange={onChange}
      format={(d) =>
        d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      }
    />
  );
}
