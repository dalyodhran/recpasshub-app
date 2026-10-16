import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/auth/AuthContext";
import { getLogo, uploadLogoFile } from "@/api/logo/logoService";
import { resolveS3Url } from "@/utils/gpxRoute";
import { useEventContext } from "@/context/event-context";
import { useOrganizerTheme } from "@/constants/organizerTheme";
import type { SportType, TagModel } from "@/models/event";
import {
  StepDetails,
  type DetailsLocalState,
  type DetailsValues,
} from "@/components/studio/StepDetails";
import type { PickedImage } from "@/components/studio/ImagePickerTile";
import { StepPlaceholder } from "@/components/studio/StepPlaceholder";
import { StepProgress } from "@/components/studio/StepProgress";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { StudioHeader } from "@/components/studio/StudioHeader";
import { StudioSuccess } from "@/components/studio/StudioSuccess";

const TOTAL_STEPS = 4;
const SUCCESS_STEP = 5;

const STEP_LABELS = ["Details", "Location", "Registration", "Review"];
const PLACEHOLDERS: Record<number, { title: string; subtitle: string }> = {
  2: { title: "Location & Details", subtitle: "Where the event happens." },
  3: { title: "Registration", subtitle: "Capacity and waiver requirements." },
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
    eventType?: string;
  }>({});

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
      eventType: draft?.eventType,
    });
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
    capacity: carry.capacity,
    sportType: values.sportType,
    terrainType: local.venue || undefined,
    eventType: carry.eventType ?? "IN_PERSON",
    startDateTime: combine(values.date, values.start)?.toISOString(),
    endDateTime: combine(values.date, values.end)?.toISOString(),
    mapGuid: carry.mapGuid,
    waiverGuid: carry.waiverGuid,
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
        ) : (
          placeholder && <StepPlaceholder {...placeholder} />
        )}
      </ScrollView>
      <StudioFooter
        primaryLabel={step === TOTAL_STEPS ? "Publish Event" : "Continue"}
        showArrow={step !== TOTAL_STEPS}
        onPrimary={handleContinue}
        loading={saving}
        disabled={logoUploading}
      />
    </KeyboardAvoidingView>
  );
}
