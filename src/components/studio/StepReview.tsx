import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MapView, { Polyline } from "react-native-maps";
import {
  DEFAULT_REGION,
  regionFromCoordinates,
  type RouteData,
} from "@/utils/gpxRoute";
import type { FAQ } from "@/models/event";
import type { PlaceResult } from "@/api/map/mapService";
import { useOrganizerTheme } from "@/constants/organizerTheme";
import { SPORT_OPTIONS } from "@/data/studioMock";
import type { DetailsLocalState, DetailsValues } from "./StepDetails";
import type { LocationEventType } from "./StepLocation";
import type { RegistrationValues } from "./StepRegistration";

const SUCCESS = "#15803d";

interface StepReviewProps {
  values: DetailsValues;
  local: DetailsLocalState;
  route: RouteData | null;
  eventType: LocationEventType;
  venue: PlaceResult | null;
  registration: RegistrationValues;
  hasWaiver: boolean;
  faqs: FAQ[];
  onEdit: (step: number) => void;
}

function combine(date: Date | null, time: Date | null): Date | null {
  if (!date || !time) return null;
  const d = new Date(date);
  d.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return d;
}

function formatDuration(start: Date, end: Date): string {
  const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
  if (minutes <= 0) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const parts = [];
  if (h) parts.push(`${h} ${h === 1 ? "hour" : "hours"}`);
  if (m) parts.push(`${m} min`);
  return parts.join(" ");
}

function formatTimeRange(start: Date | null, end: Date | null): string {
  if (!start) return "Time not set";
  const fmt = (d: Date, withZone: boolean) =>
    d.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      ...(withZone ? { timeZoneName: "short" as const } : {}),
    });
  if (!end) return fmt(start, true);
  const duration = formatDuration(start, end);
  return `${fmt(start, false)} – ${fmt(end, true)}${duration ? ` · ${duration}` : ""}`;
}

function EditButton({
  step,
  label,
  onEdit,
}: {
  step: number;
  label: string;
  onEdit: (step: number) => void;
}) {
  const t = useOrganizerTheme();
  return (
    <Pressable
      onPress={() => onEdit(step)}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={`Edit ${label}`}
    >
      <MaterialIcons name="edit" size={22} color={t.textMuted} />
    </Pressable>
  );
}

function useCardStyle() {
  const t = useOrganizerTheme();
  return [styles.card, { backgroundColor: t.surface, borderColor: t.border }];
}

function IconRow({
  icon,
  children,
  step,
  label,
  onEdit,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  children: ReactNode;
  step: number;
  label: string;
  onEdit: (step: number) => void;
}) {
  const t = useOrganizerTheme();
  const card = useCardStyle();
  return (
    <View style={[card, styles.iconRow]}>
      <MaterialIcons name={icon} size={28} color={t.primary} />
      <View style={styles.flex}>{children}</View>
      <EditButton step={step} label={label} onEdit={onEdit} />
    </View>
  );
}

export function StepReview({
  values,
  local,
  route,
  eventType,
  venue,
  registration,
  hasWaiver,
  faqs,
  onEdit,
}: StepReviewProps) {
  const t = useOrganizerTheme();
  const card = useCardStyle();

  const start = combine(values.date, values.start);
  const end = combine(values.date, values.end);
  const sportLabel =
    SPORT_OPTIONS.find((o) => o.value === values.sportType)?.label ?? "";
  const chips = [
    sportLabel,
    ...local.tags,
    eventType === "IN_PERSON" ? "In-person" : "Virtual",
  ].filter(Boolean);

  const cost =
    registration.pricing === "PAID" && parseFloat(registration.cost) > 0
      ? `$${parseFloat(registration.cost).toFixed(2)}`
      : "Free";

  const faqCount = faqs.filter((f) => f.question.trim()).length;

  return (
    <View style={styles.container}>
      <View style={[card, styles.overflowHidden]}>
        {route ? (
          <View style={styles.cover}>
            <MapView
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
              region={
                regionFromCoordinates(route.coordinates) ?? DEFAULT_REGION
              }
            >
              <Polyline
                coordinates={route.coordinates}
                strokeColor={t.primary}
                strokeWidth={4}
              />
            </MapView>
          </View>
        ) : (
          <View
            style={[
              styles.cover,
              styles.coverEmpty,
              { backgroundColor: t.track },
            ]}
          >
            <MaterialIcons name="map" size={32} color={t.placeholder} />
          </View>
        )}
        <View style={styles.titleBlock}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: t.text }]} numberOfLines={2}>
              {values.eventName || "Untitled Event"}
            </Text>
            <EditButton step={1} label="event details" onEdit={onEdit} />
          </View>
          <View style={styles.chips}>
            {chips.map((c, i) => (
              <View
                key={`${c}-${i}`}
                style={[styles.chip, { backgroundColor: t.chip }]}
              >
                <Text style={[styles.chipText, { color: t.textMuted }]}>
                  {c}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <IconRow
        icon="calendar-today"
        step={1}
        label="date and time"
        onEdit={onEdit}
      >
        <Text style={[styles.primaryText, { color: t.text }]}>
          {values.date
            ? values.date.toLocaleDateString([], {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Date not set"}
        </Text>
        <Text style={[styles.secondaryText, { color: t.textMuted }]}>
          {formatTimeRange(start, end)}
        </Text>
      </IconRow>

      <IconRow icon="location-on" step={2} label="location" onEdit={onEdit}>
        {eventType === "VIRTUAL" ? (
          <Text style={[styles.primaryText, { color: t.text }]}>
            Virtual event
          </Text>
        ) : venue ? (
          <>
            <Text style={[styles.primaryText, { color: t.text }]}>
              {venue.name}
            </Text>
            {!!venue.address && (
              <Text style={[styles.secondaryText, { color: t.textMuted }]}>
                {venue.address}
              </Text>
            )}
          </>
        ) : (
          <Text style={[styles.secondaryText, { color: t.textMuted }]}>
            Location not set
          </Text>
        )}
      </IconRow>

      <View style={[card, styles.registration]}>
        <View style={styles.flex}>
          <Row label="Capacity" border={t.border} textMuted={t.textMuted}>
            <Text style={[styles.rowValue, { color: t.text }]}>
              {registration.capacity}
            </Text>
          </Row>
          <Row label="Event cost" border={t.border} textMuted={t.textMuted}>
            <Text style={[styles.rowValue, { color: t.text }]}>{cost}</Text>
          </Row>
          <Row label="Waiver" textMuted={t.textMuted}>
            <Text
              style={[
                styles.rowValue,
                {
                  color: !registration.requireWaiver
                    ? t.textMuted
                    : hasWaiver
                      ? SUCCESS
                      : t.danger,
                },
              ]}
            >
              {!registration.requireWaiver
                ? "Not required"
                : hasWaiver
                  ? "Required · Uploaded"
                  : "Required · Missing"}
            </Text>
          </Row>
        </View>
        <View style={styles.registrationEdit}>
          <EditButton step={3} label="registration" onEdit={onEdit} />
        </View>
      </View>

      <IconRow icon="quiz" step={4} label="FAQ" onEdit={onEdit}>
        <Text style={[styles.primaryText, { color: t.text }]}>FAQ</Text>
        <Text style={[styles.secondaryText, { color: t.textMuted }]}>
          {faqCount
            ? `${faqCount} ${faqCount === 1 ? "question" : "questions"}`
            : "No questions added"}
        </Text>
      </IconRow>
    </View>
  );
}

function Row({
  label,
  children,
  border,
  textMuted,
}: {
  label: string;
  children: ReactNode;
  border?: string;
  textMuted: string;
}) {
  return (
    <View
      style={[
        styles.row,
        border ? { borderBottomWidth: 1, borderBottomColor: border } : null,
      ]}
    >
      <Text style={[styles.rowLabel, { color: textMuted }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  flex: { flex: 1 },
  card: { borderWidth: 1, borderRadius: 20 },
  overflowHidden: { overflow: "hidden" },
  cover: { width: "100%", height: 150 },
  coverEmpty: { alignItems: "center", justifyContent: "center" },
  titleBlock: { padding: 16, gap: 12 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { flex: 1, fontSize: 24, fontWeight: "800" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  chipText: { fontSize: 15, fontWeight: "600" },
  iconRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
  },
  primaryText: { fontSize: 20, fontWeight: "700" },
  secondaryText: { fontSize: 17, lineHeight: 24 },
  registration: { flexDirection: "row", padding: 16, gap: 12 },
  registrationEdit: { alignItems: "flex-end" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  rowLabel: { fontSize: 18 },
  rowValue: { fontSize: 18, fontWeight: "700" },
});
