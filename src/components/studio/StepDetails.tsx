import { StyleSheet, Text, View } from "react-native";
import type { SportType } from "@/models/event";
import { getVenueConfig, SPORT_OPTIONS } from "@/data/studioMock";
import { DateField } from "./DateField";
import { FieldLabel } from "./FieldLabel";
import { FormSection } from "./FormSection";
import { ImagePickerTile, type PickedImage } from "./ImagePickerTile";
import { OptionCardGroup } from "./OptionCardGroup";
import { RichTextField } from "./RichTextField";
import { SegmentedControl } from "./SegmentedControl";
import { TagInput } from "./TagInput";
import { TextField } from "./TextField";
import { TimeField } from "./TimeField";
import { useOrganizerTheme } from "@/constants/organizerTheme";

// Values for the fields the backend model does not carry yet (fake/local).
export interface DetailsLocalState {
  logoUri: string | null;
  venue: string;
  tags: string[];
}

export interface DetailsValues {
  sportType?: SportType;
  eventName: string;
  date: Date | null;
  start: Date | null;
  end: Date | null;
  description: string;
}

interface StepDetailsProps {
  values: DetailsValues;
  local: DetailsLocalState;
  onChange: (patch: Partial<DetailsValues>) => void;
  onLocalChange: (patch: Partial<DetailsLocalState>) => void;
  onLogoPick: (image: PickedImage) => void;
  logoUploading?: boolean;
  logoError?: string | null;
}

export function StepDetails({
  values,
  local,
  onChange,
  onLocalChange,
  onLogoPick,
  logoUploading,
  logoError,
}: StepDetailsProps) {
  const t = useOrganizerTheme();
  const venue = getVenueConfig(values.sportType);

  return (
    <View>
      <FormSection
        title="Event Details"
        subtitle="What the event is and how it appears on the Explore page."
      >
        <FieldLabel label="Sport type" required />
        <OptionCardGroup
          options={SPORT_OPTIONS}
          value={values.sportType}
          onChange={(sportType) => {
            onChange({ sportType });
            // Venue and terrain are different option sets per sport.
            onLocalChange({ venue: "" });
          }}
        />

        <FieldLabel label="Event logo & name" required />
        <View style={styles.logoRow}>
          <ImagePickerTile
            uri={local.logoUri}
            onChange={onLogoPick}
            loading={logoUploading}
          />
          <TextField
            style={styles.flex}
            value={values.eventName}
            onChangeText={(eventName) => onChange({ eventName })}
            placeholder="Event name"
          />
        </View>
        <Text style={[styles.hint, { color: t.textMuted }]}>
          Logo appears on the Explore page.
        </Text>
        {logoError ? (
          <Text style={[styles.hint, { color: t.danger }]}>{logoError}</Text>
        ) : null}

        <FieldLabel label={venue.label} required />
        <SegmentedControl
          options={venue.options}
          value={local.venue}
          onChange={(v) => onLocalChange({ venue: v })}
        />
        <Text style={[styles.hint, { color: t.textMuted }]}>{venue.hint}</Text>

        <FieldLabel label="Tags" optional />
        <TagInput
          tags={local.tags}
          onChange={(tags) => onLocalChange({ tags })}
        />
        <Text style={[styles.hint, { color: t.textMuted }]}>
          Shown beside the sport tag on the Explore page.
        </Text>
      </FormSection>

      <View style={styles.gap} />

      <FormSection title="Date & Time" subtitle="When the event runs.">
        <FieldLabel label="Date" required />
        <DateField
          value={values.date}
          onChange={(date) => onChange({ date })}
        />
        <FieldLabel label="Start" required />
        <TimeField
          value={values.start}
          onChange={(start) => onChange({ start })}
        />
        <FieldLabel label="End" required />
        <TimeField value={values.end} onChange={(end) => onChange({ end })} />
      </FormSection>

      <View style={styles.gap} />

      <FormSection
        title="Event Description"
        subtitle="Tell attendees what to expect: schedule, rules and anything they should bring."
      >
        <RichTextField
          value={values.description}
          onChangeText={(description) => onChange({ description })}
          placeholder="Describe your event..."
        />
      </FormSection>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  logoRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  hint: { fontSize: 15, marginTop: 8 },
  gap: { height: 24 },
});
