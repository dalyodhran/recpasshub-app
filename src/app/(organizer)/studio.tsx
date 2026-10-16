import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/auth/AuthContext";
import { getLogo, uploadLogoFile } from "@/api/logo/logoService";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import {
  fetchGpxRouteFromS3,
  parseGpxRoute,
  resolveS3Url,
  type RouteData,
} from "@/utils/gpxRoute";
import { useEventContext } from "@/context/event-context";
import { useOrganizerTheme } from "@/constants/organizerTheme";
import type { SportType, TagModel } from "@/models/event";
import {
  StepDetails,
  type DetailsLocalState,
  type DetailsValues,
} from "@/components/studio/StepDetails";
import type { PickedImage } from "@/components/studio/ImagePickerTile";
import {
  StepLocation,
  type LocationEventType,
} from "@/components/studio/StepLocation";
import { StepPlaceholder } from "@/components/studio/StepPlaceholder";
import {
  StepRegistration,
  type RegistrationValues,
  type WaiverFileInfo,
} from "@/components/studio/StepRegistration";
import { uploadWaiverFile } from "@/api/waiver/waiverService";
import {
  reverseGeocode,
  uploadMapFile,
  type PlaceResult,
} from "@/api/map/mapService";
import { StepProgress } from "@/components/studio/StepProgress";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { StudioHeader } from "@/components/studio/StudioHeader";
import { StudioSuccess } from "@/components/studio/StudioSuccess";

const TOTAL_STEPS = 4;
const SUCCESS_STEP = 5;

const STEP_LABELS = ["Details", "Location", "Registration", "Review"];
const DEFAULT_CAPACITY = 200;
const PLACEHOLDERS: Record<number, { title: string; subtitle: string }> = {
  4: { title: "Review & Publish", subtitle: "Review before publishing." },
};

const EMPTY_VALUES: DetailsValues = {
  sportType: "SWIMMING",
  eventName: "",
  date: null,
  start: null,
  end: null,
  description: "",
};

// Combine a calendar date with a time-of-day into one Date.
function combine(date: Date | null, time: Date | null): Date | null {
  if (!date || !time) return null;
  const d = new Date(date);
  d.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return d;
}

export default function EventStudio() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const t = useOrganizerTheme();
  const { id, step: queryStep } = useGlobalSearchParams();
  const { authService } = useAuth();
  const { user, events, saveDraft, publishEvent } = useEventContext();

  const eventIdParam = Array.isArray(id) ? id[0] : id;
  const [draftId] = useState(() => eventIdParam || `draft-${Date.now()}`);
  const [eventGuid, setEventGuid] = useState<string>(draftId);
  const [loadedEventId, setLoadedEventId] = useState<string | null>(null);
  const [step, setStep] = useState(
    queryStep ? parseInt(queryStep as string, 10) : 1,
  );
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const [values, setValues] = useState<DetailsValues>(EMPTY_VALUES);
  // Fields without model support yet; fake/local until the data flow is built.
  const [local, setLocal] = useState<DetailsLocalState>({
    logoUri: null,
    venue: "",
    tags: [],
  });
  // Existing event fields the new step 1 doesn't edit but must not drop on save.
  const [carry, setCarry] = useState<{
    capacity?: number;
    mapGuid?: string;
    waiverGuid?: string;
    logoGuid?: string;
  }>({});
  const [eventType, setEventType] = useState<LocationEventType>("IN_PERSON");
  const [venue, setVenue] = useState<PlaceResult | null>(null);
  // True while the venue was filled from the GPX start point, so a new map may replace it.
  const [venueDerived, setVenueDerived] = useState(false);
  const [route, setRoute] = useState<RouteData | null>(null);
  const [mapUploading, setMapUploading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  // Price (free/paid + cost) has no model field yet, so it stays local.
  const [registration, setRegistration] = useState<RegistrationValues>({
    capacity: DEFAULT_CAPACITY,
    pricing: "FREE",
    cost: "",
    requireWaiver: false,
  });
  const [waiverFile, setWaiverFile] = useState<WaiverFileInfo | null>(null);
  const [waiverUploading, setWaiverUploading] = useState(false);
  const [waiverError, setWaiverError] = useState<string | null>(null);

  // Hydrate from an existing draft/event.
  useEffect(() => {
    if (!eventIdParam || eventIdParam === loadedEventId) return;
    const draft = events.find((e) => e.eventGuid === eventIdParam);
    if (!draft && !eventIdParam.startsWith("draft-")) return;

    // events load asynchronously from context, so hydrate once they arrive
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues({
      sportType: (draft?.sportType as SportType) || "SWIMMING",
      eventName:
        draft?.eventName === "Untitled Event" ? "" : draft?.eventName || "",
      date: draft?.startDateTime ? new Date(draft.startDateTime) : null,
      start: draft?.startDateTime ? new Date(draft.startDateTime) : null,
      end: draft?.endDateTime ? new Date(draft.endDateTime) : null,
      description: draft?.description || "",
    });
    setCarry({
      capacity: draft?.capacity,
      mapGuid: draft?.mapGuid,
      waiverGuid: draft?.waiverGuid,
      logoGuid: draft?.logoGuid,
    });
    setRegistration((r) => ({
      ...r,
      capacity: draft?.capacity ?? DEFAULT_CAPACITY,
      requireWaiver: !!draft?.waiverGuid,
    }));
    if (draft?.waiver?.s3FileLocation) {
      const name = decodeURIComponent(
        draft.waiver.s3FileLocation.split("?")[0].split("/").pop() ?? "",
      );
      setWaiverFile({ name: name || "Waiver.pdf" });
    }
    setEventType(draft?.eventType === "VIRTUAL" ? "VIRTUAL" : "IN_PERSON");
    if (draft?.latitude != null && draft?.longitude != null) {
      const { latitude, longitude } = draft;
      setVenue({ name: "Selected location", address: "", latitude, longitude });
      reverseGeocode(latitude, longitude).then((place) => {
        if (place) setVenue(place);
      });
    }
    setLocal((l) => ({
      ...l,
      venue: draft?.terrainType ?? "",
      tags: (draft?.tags ?? []).map((tag) => tag.name),
      ...(draft?.logo?.s3FileLocation
        ? { logoUri: resolveS3Url(draft.logo.s3FileLocation) }
        : {}),
    }));
    setEventGuid(draft?.eventGuid || eventIdParam);
    setLoadedEventId(eventIdParam);

    if (draft?.map?.s3FileLocation) {
      const { s3FileLocation, distance, elevation } = draft.map;
      fetchGpxRouteFromS3(s3FileLocation, {
        distanceKm: distance / 1000,
        elevationGainM: elevation,
      })
        .then(async (loaded) => {
          setRoute(loaded);
          // No saved venue yet: derive it from where the route starts.
          const start = loaded?.coordinates[0];
          if (start && draft.latitude == null) {
            const place = await reverseGeocode(start.latitude, start.longitude);
            if (place) {
              setVenue(place);
              setVenueDerived(true);
            }
          }
        })
        // preview stays on the upload placeholder
        .catch((err) => console.warn("Failed to load map", err));
    }

    // Logo not embedded on the event: fetch it by guid.
    if (draft?.logoGuid && !draft.logo?.s3FileLocation) {
      const logoGuid = draft.logoGuid;
      (async () => {
        try {
          const token = await authService.getAccessToken();
          if (!token) return;
          const res = await getLogo(token, logoGuid);
          if (res?.s3FileLocation) {
            setLocal((l) => ({
              ...l,
              logoUri: resolveS3Url(res.s3FileLocation!),
            }));
          }
        } catch (err) {
          // preview stays empty
          console.warn("Failed to load logo", err);
        }
      })();
    }
  }, [eventIdParam, events, loadedEventId, authService]);

  const buildPayload = () => ({
    eventGuid,
    eventName: values.eventName || "Untitled Event",
    description: values.description,
    tags: local.tags.map((name): TagModel => ({ name })),
    capacity: registration.capacity,
    sportType: values.sportType,
    terrainType: local.venue || undefined,
    eventType,
    latitude: eventType === "IN_PERSON" ? venue?.latitude : undefined,
    longitude: eventType === "IN_PERSON" ? venue?.longitude : undefined,
    startDateTime: combine(values.date, values.start)?.toISOString(),
    endDateTime: combine(values.date, values.end)?.toISOString(),
    mapGuid: carry.mapGuid,
    waiverGuid: registration.requireWaiver ? carry.waiverGuid : undefined,
    logoGuid: carry.logoGuid,
    organizationGuid: user?.id,
  });

  const handleLogoPick = async (image: PickedImage) => {
    const previous = local.logoUri;
    setLocal((l) => ({ ...l, logoUri: image.uri }));
    setLogoError(null);
    setLogoUploading(true);
    try {
      const token = await authService.getAccessToken();
      if (!token) throw new Error("Not signed in");
      const res = await uploadLogoFile(
        token,
        image.uri,
        image.fileName,
        image.mimeType,
      );
      setCarry((c) => ({ ...c, logoGuid: res.logoGuid }));
    } catch {
      setLocal((l) => ({ ...l, logoUri: previous }));
      setLogoError("Couldn't upload the logo. Please try again.");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleMapPick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets[0]) return;
    const file = result.assets[0];

    setMapError(null);
    if (!file.name.toLowerCase().endsWith(".gpx")) {
      setMapError("Please choose a .gpx file.");
      return;
    }
    setMapUploading(true);
    try {
      const token = await authService.getAccessToken();
      if (!token) throw new Error("Not signed in");
      const res = await uploadMapFile(
        token,
        file.uri,
        file.name,
        file.mimeType ?? "application/gpx+xml",
      );
      const content = await FileSystem.readAsStringAsync(file.uri);
      const parsed = parseGpxRoute(content, {
        distanceKm: res.distance / 1000,
        elevationGainM: res.elevation,
      });
      if (!parsed) throw new Error("No track in GPX");
      setCarry((c) => ({ ...c, mapGuid: res.mapGuid }));
      setRoute(parsed);

      // Derive the venue from where the route starts, unless the organizer
      // picked one by hand.
      if (!venue || venueDerived) {
        const start = parsed.coordinates[0];
        const place = start
          ? await reverseGeocode(start.latitude, start.longitude)
          : null;
        if (place) {
          setVenue(place);
          setVenueDerived(true);
        }
      }
    } catch {
      setMapError("Couldn't upload the map. Please try again.");
    } finally {
      setMapUploading(false);
    }
  };

  const handleWaiverPick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets[0]) return;
    const file = result.assets[0];

    setWaiverError(null);
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setWaiverError("Please choose a PDF file.");
      return;
    }
    setWaiverUploading(true);
    try {
      const token = await authService.getAccessToken();
      if (!token) throw new Error("Not signed in");
      const res = await uploadWaiverFile(
        token,
        file.uri,
        file.name,
        file.mimeType ?? "application/pdf",
      );
      setCarry((c) => ({ ...c, waiverGuid: res.waiverGuid }));
      setWaiverFile({ name: file.name, sizeBytes: file.size });
    } catch {
      setWaiverError("Couldn't upload the waiver. Please try again.");
    } finally {
      setWaiverUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const saved = await saveDraft(buildPayload());
      if (saved?.eventGuid && eventGuid.startsWith("draft-")) {
        setEventGuid(saved.eventGuid);
        setLoadedEventId(saved.eventGuid);
        router.setParams({ id: saved.eventGuid });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = async () => {
    if (step === TOTAL_STEPS) {
      publishEvent(eventGuid);
      setStep(SUCCESS_STEP);
      return;
    }
    await handleSaveDraft();
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      router.back();
    }
  };

  if (step === SUCCESS_STEP) {
    return (
      <StudioSuccess
        onDashboard={() => router.replace("/")}
        onEventList={() => router.replace("/")}
      />
    );
  }

  const placeholder = PLACEHOLDERS[step];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: t.background, paddingTop: insets.top }}
    >
      <StudioHeader
        title="Event Studio"
        onBack={handleBack}
        rightIcon="save"
        onRightPress={handleSaveDraft}
      />
      <StepProgress
        step={step}
        total={TOTAL_STEPS}
        label={STEP_LABELS[step - 1]}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {step === 1 ? (
          <StepDetails
            values={values}
            local={local}
            onChange={(patch) => setValues((v) => ({ ...v, ...patch }))}
            onLocalChange={(patch) => setLocal((l) => ({ ...l, ...patch }))}
            onLogoPick={handleLogoPick}
            logoUploading={logoUploading}
            logoError={logoError}
          />
        ) : step === 2 ? (
          <StepLocation
            eventType={eventType}
            venue={venue}
            onEventTypeChange={setEventType}
            onVenueChange={(place) => {
              setVenue(place);
              setVenueDerived(false);
            }}
            route={route}
            mapUploading={mapUploading}
            mapError={mapError}
            onMapPick={handleMapPick}
          />
        ) : step === 3 ? (
          <StepRegistration
            values={registration}
            onChange={(patch) => setRegistration((r) => ({ ...r, ...patch }))}
            waiverFile={waiverFile}
            waiverUploading={waiverUploading}
            waiverError={waiverError}
            onWaiverPick={handleWaiverPick}
          />
        ) : (
          placeholder && <StepPlaceholder {...placeholder} />
        )}
      </ScrollView>
      <StudioFooter
        primaryLabel={
          step === TOTAL_STEPS
            ? "Publish Event"
            : step === 3
              ? "Review"
              : "Continue"
        }
        showArrow={step !== TOTAL_STEPS}
        onPrimary={handleContinue}
        loading={saving}
        disabled={
          logoUploading ||
          mapUploading ||
          (step === 3 &&
            (waiverUploading ||
              (registration.requireWaiver && !carry.waiverGuid && !waiverFile) ||
              (registration.pricing === "PAID" &&
                !(parseFloat(registration.cost) > 0)))) ||
          (step === 2 && eventType === "IN_PERSON" && !venue)
        }
      />
    </KeyboardAvoidingView>
  );
}
