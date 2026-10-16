import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useOrganizerTheme } from "@/constants/organizerTheme";
import type { StudioOption } from "@/data/studioMock";
import { FieldLabel } from "./FieldLabel";
import { FormSection } from "./FormSection";
import { SegmentedControl } from "./SegmentedControl";
import { TextField } from "./TextField";

export type PricingMode = "FREE" | "PAID";

export interface RegistrationValues {
  capacity: number;
  pricing: PricingMode;
  cost: string;
  requireWaiver: boolean;
}

export interface WaiverFileInfo {
  name: string;
  sizeBytes?: number;
}

const PRICING_OPTIONS: StudioOption<PricingMode>[] = [
  { value: "FREE", label: "Free" },
  { value: "PAID", label: "Paid" },
];

const MIN_CAPACITY = 1;

function formatSize(bytes?: number): string | null {
  if (bytes == null) return null;
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

// Keep digits and a single decimal point, with at most two decimal places.
function sanitizeCost(text: string): string {
  const cleaned = text.replace(/[^0-9.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  return rest.length ? `${whole}.${rest.join("").slice(0, 2)}` : whole;
}

interface StepRegistrationProps {
  values: RegistrationValues;
  onChange: (patch: Partial<RegistrationValues>) => void;
  waiverFile: WaiverFileInfo | null;
  waiverUploading?: boolean;
  waiverError?: string | null;
  onWaiverPick: () => void;
}

export function StepRegistration({
  values,
  onChange,
  waiverFile,
  waiverUploading,
  waiverError,
  onWaiverPick,
}: StepRegistrationProps) {
  const t = useOrganizerTheme();
  const card = { backgroundColor: t.surface, borderColor: t.border };
  const sizeLabel = formatSize(waiverFile?.sizeBytes);

  return (
    <FormSection
      title="Registration"
      subtitle="Configure capacity, pricing, and document requirements."
    >
      <View style={styles.gap} />

      <View style={[styles.card, styles.row, card]}>
        <View style={styles.flex}>
          <Text style={[styles.cardTitle, { color: t.text }]}>
            Maximum capacity
          </Text>
          <Text style={[styles.hint, { color: t.textMuted }]}>
            Registration closes when full
          </Text>
        </View>
        <View style={[styles.stepper, { borderColor: t.border }]}>
          <Pressable
            onPress={() =>
              onChange({
                capacity: Math.max(MIN_CAPACITY, values.capacity - 1),
              })
            }
            accessibilityRole="button"
            accessibilityLabel="Decrease capacity"
            hitSlop={8}
            style={styles.stepBtn}
          >
            <MaterialIcons name="remove" size={22} color={t.textMuted} />
          </Pressable>
          <Text style={[styles.count, { color: t.text }]}>
            {values.capacity}
          </Text>
          <Pressable
            onPress={() => onChange({ capacity: values.capacity + 1 })}
            accessibilityRole="button"
            accessibilityLabel="Increase capacity"
            hitSlop={8}
            style={styles.stepBtn}
          >
            <MaterialIcons name="add" size={22} color={t.textMuted} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.card, card]}>
        <Text style={[styles.cardTitle, { color: t.text }]}>Pricing</Text>
        <View style={styles.block}>
          <SegmentedControl
            options={PRICING_OPTIONS}
            value={values.pricing}
            onChange={(pricing) => onChange({ pricing })}
          />
        </View>
        {values.pricing === "PAID" ? (
          <View style={styles.block}>
            <FieldLabel label="Event cost" />
            <View style={styles.costRow}>
              <Text style={[styles.currency, { color: t.text }]}>$</Text>
              <TextField
                value={values.cost}
                onChangeText={(text) => onChange({ cost: sanitizeCost(text) })}
                keyboardType="decimal-pad"
                placeholder="0.00"
                style={styles.costInput}
              />
            </View>
          </View>
        ) : null}
      </View>

      <View style={[styles.card, card]}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={[styles.cardTitle, { color: t.text }]}>
              Require waiver
            </Text>
            <Text style={[styles.hint, { color: t.textMuted }]}>
              Must be accepted before registering
            </Text>
          </View>
          <Switch
            value={values.requireWaiver}
            onValueChange={(requireWaiver) => onChange({ requireWaiver })}
            trackColor={{ true: t.primary, false: t.track }}
            accessibilityLabel="Require waiver"
          />
        </View>

        {values.requireWaiver ? (
          <View style={styles.block}>
            {waiverFile ? (
              <View
                style={[
                  styles.fileRow,
                  { backgroundColor: t.background, borderColor: t.border },
                ]}
              >
                <View style={[styles.pdfBadge, { backgroundColor: "#FDE4E4" }]}>
                  <MaterialIcons
                    name="picture-as-pdf"
                    size={24}
                    color={t.danger}
                  />
                </View>
                <View style={styles.flex}>
                  <Text
                    numberOfLines={1}
                    style={[styles.fileName, { color: t.text }]}
                  >
                    {waiverFile.name}
                  </Text>
                  <Text style={[styles.fileMeta, { color: t.textMuted }]}>
                    {[sizeLabel, "Uploaded just now"].filter(Boolean).join(" · ")}
                  </Text>
                </View>
                {waiverUploading ? (
                  <ActivityIndicator color={t.primary} />
                ) : (
                  <Pressable
                    onPress={onWaiverPick}
                    accessibilityRole="button"
                    hitSlop={8}
                  >
                    <Text style={[styles.replace, { color: t.primaryDark }]}>
                      Replace
                    </Text>
                  </Pressable>
                )}
              </View>
            ) : (
              <Pressable
                onPress={onWaiverPick}
                disabled={waiverUploading}
                accessibilityRole="button"
                style={[styles.uploadTile, { borderColor: t.border }]}
              >
                {waiverUploading ? (
                  <ActivityIndicator color={t.primary} />
                ) : (
                  <MaterialIcons
                    name="upload-file"
                    size={28}
                    color={t.primaryDark}
                  />
                )}
                <Text style={[styles.replace, { color: t.primaryDark }]}>
                  Upload waiver (PDF)
                </Text>
              </Pressable>
            )}
            {waiverError ? (
              <Text style={[styles.hint, { color: t.danger }]}>
                {waiverError}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </FormSection>
  );
}

const styles = StyleSheet.create({
  gap: { height: 16 },
  flex: { flex: 1 },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  block: { marginTop: 16, gap: 8 },
  cardTitle: { fontSize: 20, fontWeight: "700" },
  hint: { fontSize: 15, marginTop: 4 },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    height: 48,
  },
  stepBtn: { width: 40, alignItems: "center", justifyContent: "center" },
  count: {
    minWidth: 52,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
  },
  costRow: { justifyContent: "center" },
  currency: {
    position: "absolute",
    left: 16,
    zIndex: 1,
    fontSize: 18,
  },
  costInput: { paddingLeft: 34 },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  pdfBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: { fontSize: 17, fontWeight: "700" },
  fileMeta: { fontSize: 14, marginTop: 2 },
  replace: { fontSize: 16, fontWeight: "700" },
  uploadTile: {
    height: 88,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
});
