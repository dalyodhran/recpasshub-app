import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  useColorScheme,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useEventContext } from "@/context/event-context";
import { EventModel } from "@/models/event";
import { useAuth } from "@/auth/AuthContext";
import { uploadMapFile, getCityFromCoordinates, getMapById, resolveDisplayLocation } from "@/api/map/mapService";

export default function EventStudio() {
  const router = useRouter();
  const { id, step: queryStep } = useGlobalSearchParams();
  const { events, saveDraft, publishEvent } = useEventContext();
  const { authService } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // Using the exact colors from the design system
  const primaryColor = isDark ? "#f59e0b" : "#d97706";
  const bgColor = isDark ? "#121212" : "#f8f9ff";
  const surfaceColor = isDark ? "#1e1e1e" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#0b1c30";
  const textVariantColor = isDark ? "#a0a4ab" : "#554336";
  const outlineColor = isDark ? "#33353a" : "#dbc2b0";
  const surfaceBright = isDark ? "#1e1e1e" : "#f8f9ff";

  const [loadedEventId, setLoadedEventId] = useState<string | null>(null);

  const eventIdParam = Array.isArray(id) ? id[0] : id;
  const existingDraft = eventIdParam
    ? events.find((e) => e.eventGuid === eventIdParam)
    : null;
  const draftId = (eventIdParam as string) || `draft-${Date.now()}`;

  const [step, setStep] = useState(
    queryStep ? parseInt(queryStep as string) : 1,
  );

  interface StudioFormData extends Partial<EventModel> {
    dateStr?: string;
    location?: string;
    maxAttendees?: string;
    isMultiDay?: boolean;
    startTime?: string;
    endTime?: string;
    requireWaiver?: boolean;
    routeFile?: DocumentPicker.DocumentPickerAsset | null;
  }

  const [formData, setFormData] = useState<StudioFormData>({
    eventGuid: draftId,
    eventName: "",
    dateStr: "",
    location: "",
    maxAttendees: "",
    description: "",
    sportType: "SWIMMING",
    eventType: "IN_PERSON",
    isMultiDay: false,
    startTime: "",
    endTime: "",
    routeFile: null,
  });

  useEffect(() => {
    if (eventIdParam && eventIdParam !== loadedEventId) {
      const draft = events.find((e) => e.eventGuid === eventIdParam);
      const isDraftId =
        typeof eventIdParam === "string" && eventIdParam.startsWith("draft-");

      if (draft || isDraftId) {
        let initDate = "";
        let initStart = "";
        let initEnd = "";
        if (draft?.startDateTime) {
          const d = new Date(draft.startDateTime);
          initDate = d.toISOString().split("T")[0];
          initStart = d.toTimeString().substring(0, 5);
        }
        if (draft?.endDateTime) {
          initEnd = new Date(draft.endDateTime).toTimeString().substring(0, 5);
        }

        setFormData({
          eventGuid: draft?.eventGuid || (eventIdParam as string),
          eventName:
            draft?.eventName === "Untitled Event" ? "" : draft?.eventName || "",
          dateStr: initDate,
          location: "",
          maxAttendees: draft?.capacity ? draft.capacity.toString() : "",
          description: draft?.description || "",
          sportType: draft?.sportType || "SWIMMING",
          eventType: draft?.eventType || "IN_PERSON",
          isMultiDay: false,
          startTime: initStart,
          endTime: initEnd,
          mapGuid: draft?.mapGuid,
        });
        setLoadedEventId(eventIdParam as string);
      }
    }
  }, [eventIdParam, events, loadedEventId]);

  useEffect(() => {
    const fetchMapMetadata = async () => {
      if (formData.mapGuid && !formData.location) {
        const token = await authService.getAccessToken();
        if (token) {
          try {
            const mapData = await getMapById(token, formData.mapGuid);
            const displayLocation = await resolveDisplayLocation(mapData.location);

            setFormData((prev) => ({
              ...prev,
              location: displayLocation,
            }));
          } catch (err) {
            console.error("Failed to fetch map metadata", err);
          }
        }
      }
    };

    fetchMapMetadata();
  }, [formData.mapGuid]);

  const buildPayload = () => {
    let startDateTime = undefined;
    let endDateTime = undefined;
    try {
      if (formData.dateStr && formData.startTime) {
        startDateTime = new Date(
          `${formData.dateStr}T${formData.startTime}:00`,
        ).toISOString();
      }
      if (formData.dateStr && formData.endTime) {
        endDateTime = new Date(
          `${formData.dateStr}T${formData.endTime}:00`,
        ).toISOString();
      }
    } catch (e) {}

    return {
      eventGuid: formData.eventGuid,
      eventName: formData.eventName || "Untitled Event",
      description: formData.description,
      capacity: formData.maxAttendees
        ? parseInt(formData.maxAttendees)
        : undefined,
      sportType: formData.sportType,
      eventType: formData.eventType,
      startDateTime,
      endDateTime,
      mapGuid: formData.mapGuid,
    };
  };

  const handleSaveDraft = async () => {
    const savedEvent = await saveDraft(buildPayload());
    if (
      savedEvent?.eventGuid &&
      formData.eventGuid?.toString().startsWith("draft-")
    ) {
      setFormData((prev: any) => ({
        ...prev,
        eventGuid: savedEvent.eventGuid!,
      }));
      setLoadedEventId(savedEvent.eventGuid);
      router.setParams({ id: savedEvent.eventGuid });
    }
  };

  const nextStep = () => {
    handleSaveDraft();
    setStep((prev: any) => prev + 1);
  };

  const prevStep = () => {
    handleSaveDraft();
    setStep((prev: any) => Math.max(1, prev - 1));
  };

  const handlePublish = () => {
    publishEvent(draftId);
    setStep(5); // Success step
  };

  const handleRouteUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.name.toLowerCase().endsWith(".gpx")) {
          const token = await authService.getAccessToken();
          if (!token) {
            alert("Not authenticated.");
            return;
          }

          try {
            const response = await uploadMapFile(
              token,
              file.uri,
              file.name,
              file.mimeType || "application/octet-stream",
            );

            const displayLocation = await resolveDisplayLocation(response.location);

            setFormData((prev) => ({
              ...prev,
              routeFile: file,
              mapGuid: response.mapGuid,
              location: displayLocation,
            }));
            console.log(
              "Map uploaded successfully, mapGuid:",
              response.mapGuid,
              "location:",
              displayLocation
            );
          } catch (uploadError) {
            console.error("Failed to upload map file:", uploadError);
            alert("Failed to upload the map file.");
          }
        } else {
          alert("Please upload a valid GPX file.");
        }
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.progressHeader}>
      <View style={styles.progressLabels}>
        <Text style={[styles.progressStepText, { color: textVariantColor }]}>
          Step {step} of 4
        </Text>
        <Text style={[styles.progressPercentText, { color: primaryColor }]}>
          {step * 25}%
        </Text>
      </View>
      <View
        style={[
          styles.progressBarBg,
          { backgroundColor: isDark ? "#33353a" : "#e5eeff" },
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            { backgroundColor: primaryColor, width: `${step * 25}%` },
          ]}
        />
      </View>
      <Text style={[styles.stepTitle, { color: textColor }]}>
        {step === 1
          ? "Event Details"
          : step === 2
            ? "Location & Details"
            : step === 3
              ? "Registration"
              : "Review & Publish"}
      </Text>
      <Text style={[styles.stepSubtitle, { color: textVariantColor }]}>
        {step === 1
          ? "Establish the core identity and timing for your upcoming event."
          : step === 2
            ? "Define where your event will happen and provide key information for attendees."
            : step === 3
              ? "Configure attendee capacity and document requirements for this event."
              : "Please review the details below before publishing your event."}
      </Text>
    </View>
  );

  if (step === 5) {
    return (
      <View style={[styles.successContainer, { backgroundColor: bgColor }]}>
        <View
          style={[
            styles.successCard,
            { backgroundColor: surfaceColor, borderColor: outlineColor },
          ]}
        >
          <View
            style={[
              styles.successIconCircle,
              { backgroundColor: isDark ? "#4d2900" : "#ffdcc3" },
            ]}
          >
            <MaterialIcons name="check-circle" size={48} color={primaryColor} />
          </View>
          <Text style={[styles.successTitle, { color: textColor }]}>
            Event Published Successfully!
          </Text>
          <Text style={[styles.successSubtitle, { color: textVariantColor }]}>
            Your event is live and ready for attendees.
          </Text>

          <View style={styles.successBtnRow}>
            <Pressable
              style={[
                styles.successBtn,
                styles.successBtnPrimary,
                { backgroundColor: primaryColor },
              ]}
              onPress={() => {
                // Navigate back to dashboard with the new event selected
                router.replace("/");
              }}
            >
              <MaterialIcons name="dashboard" size={20} color="#ffffff" />
              <Text style={[styles.successBtnText, { color: "#ffffff" }]}>
                View Event Dashboard
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.successBtn,
                { backgroundColor: isDark ? "#33353a" : "#e5eeff" },
              ]}
              onPress={() => router.replace("/")}
            >
              <MaterialIcons name="list" size={20} color={textColor} />
              <Text style={[styles.successBtnText, { color: textColor }]}>
                Back to Event List
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: bgColor }}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: surfaceColor, borderBottomColor: outlineColor },
        ]}
      >
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="close" size={24} color={primaryColor} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: primaryColor }]}>
            Event Studio
          </Text>
        </View>
        <Pressable onPress={handleSaveDraft} style={styles.draftsButton}>
          <Text style={[styles.draftsButtonText, { color: primaryColor }]}>
            Drafts
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {step < 5 && renderStepIndicator()}

        {step === 1 && (
          <View
            style={[
              styles.formCard,
              { backgroundColor: surfaceColor, borderColor: outlineColor },
            ]}
          >
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>
                Sport Type <Text style={{ color: "#ba1a1a" }}>*</Text>
              </Text>
              <View style={styles.sportGrid}>
                {[
                  { id: "SWIMMING", label: "Swimming", icon: "pool" },
                  { id: "RUNNING", label: "Running", icon: "directions-run" },
                  { id: "CYCLING", label: "Cycling", icon: "directions-bike" },
                ].map((sport) => {
                  const isActive = formData.sportType === sport.id;
                  return (
                    <Pressable
                      key={sport.id}
                      style={[
                        styles.sportCard,
                        {
                          backgroundColor: surfaceBright,
                          borderColor: isActive ? primaryColor : outlineColor,
                        },
                        isActive && { borderWidth: 2 },
                      ]}
                      onPress={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          sportType: sport.id,
                        }))
                      }
                    >
                      <MaterialIcons
                        name={sport.icon as any}
                        size={24}
                        color={isActive ? primaryColor : textVariantColor}
                        style={styles.sportIcon}
                      />
                      <Text
                        style={[
                          styles.sportLabel,
                          { color: isActive ? textColor : textVariantColor },
                          isActive && { fontWeight: "bold" },
                        ]}
                      >
                        {sport.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>
                Event Name <Text style={{ color: "#ba1a1a" }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor: outlineColor,
                    backgroundColor: surfaceBright,
                  },
                ]}
                placeholder="e.g., Annual Leadership Summit"
                placeholderTextColor={textVariantColor}
                value={formData.eventName}
                onChangeText={(t) =>
                  setFormData((prev: any) => ({ ...prev, eventName: t }))
                }
              />
              <Text style={[styles.helperText, { color: textVariantColor }]}>
                Make it clear and memorable for attendees.
              </Text>
            </View>

            <View style={styles.rowGrid}>
              <View style={styles.halfWidth}>
                <Text style={[styles.label, { color: textColor }]}>
                  Date <Text style={{ color: "#ba1a1a" }}>*</Text>
                </Text>
                <View style={styles.inputWithIcon}>
                  <MaterialIcons
                    name="calendar-month"
                    size={20}
                    color={textVariantColor}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.pl10,
                      {
                        color: textColor,
                        borderColor: outlineColor,
                        backgroundColor: surfaceBright,
                      },
                    ]}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={textVariantColor}
                    value={formData.dateStr}
                    onChangeText={(t) =>
                      setFormData((prev: any) => ({ ...prev, dateStr: t }))
                    }
                  />
                </View>
              </View>

              <View style={[styles.halfWidth, styles.checkboxContainer]}>
                <Pressable
                  style={styles.checkboxRow}
                  onPress={() =>
                    setFormData((prev: any) => ({
                      ...prev,
                      isMultiDay: !prev.isMultiDay,
                    }))
                  }
                >
                  <MaterialIcons
                    name={
                      formData.isMultiDay
                        ? "check-box"
                        : "check-box-outline-blank"
                    }
                    size={24}
                    color={formData.isMultiDay ? primaryColor : outlineColor}
                  />
                  <Text
                    style={[styles.checkboxLabel, { color: textVariantColor }]}
                  >
                    This is a multi-day event
                  </Text>
                </Pressable>
              </View>
            </View>

            <View
              style={[
                styles.divider,
                { borderTopColor: isDark ? "#33353a" : "#e5eeff" },
              ]}
            />

            <View style={styles.rowGrid}>
              <View style={styles.halfWidth}>
                <Text style={[styles.label, { color: textColor }]}>
                  Start Time <Text style={{ color: "#ba1a1a" }}>*</Text>
                </Text>
                <View style={styles.inputWithIcon}>
                  <MaterialIcons
                    name="schedule"
                    size={20}
                    color={textVariantColor}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.pl10,
                      {
                        color: textColor,
                        borderColor: outlineColor,
                        backgroundColor: surfaceBright,
                      },
                    ]}
                    placeholder="00:00"
                    placeholderTextColor={textVariantColor}
                    value={formData.startTime}
                    onChangeText={(t) =>
                      setFormData((prev: any) => ({ ...prev, startTime: t }))
                    }
                  />
                </View>
              </View>

              <View style={styles.halfWidth}>
                <Text style={[styles.label, { color: textColor }]}>
                  End Time <Text style={{ color: "#ba1a1a" }}>*</Text>
                </Text>
                <View style={styles.inputWithIcon}>
                  <MaterialIcons
                    name="update"
                    size={20}
                    color={textVariantColor}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.pl10,
                      {
                        color: textColor,
                        borderColor: outlineColor,
                        backgroundColor: surfaceBright,
                      },
                    ]}
                    placeholder="00:00"
                    placeholderTextColor={textVariantColor}
                    value={formData.endTime}
                    onChangeText={(t) =>
                      setFormData((prev: any) => ({ ...prev, endTime: t }))
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <View
              style={[
                styles.formCard,
                {
                  backgroundColor: surfaceColor,
                  borderColor: outlineColor,
                  marginBottom: 24,
                },
              ]}
            >
              <View style={styles.toggleHeader}>
                <Text style={[styles.sectionHeading, { color: textColor }]}>
                  Event Type
                </Text>
                <View
                  style={[
                    styles.toggleGroup,
                    { backgroundColor: isDark ? "#33353a" : "#e5eeff" },
                  ]}
                >
                  <Pressable
                    style={[
                      styles.toggleBtn,
                      formData.eventType === "IN_PERSON" && [
                        styles.toggleBtnActive,
                        {
                          backgroundColor: surfaceColor,
                          borderColor: outlineColor,
                        },
                      ],
                    ]}
                    onPress={() =>
                      setFormData((prev: any) => ({
                        ...prev,
                        eventType: "IN_PERSON",
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        {
                          color:
                            formData.eventType === "IN_PERSON"
                              ? textColor
                              : textVariantColor,
                        },
                      ]}
                    >
                      In-Person
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.toggleBtn,
                      formData.eventType === "VIRTUAL" && [
                        styles.toggleBtnActive,
                        {
                          backgroundColor: surfaceColor,
                          borderColor: outlineColor,
                        },
                      ],
                    ]}
                    onPress={() =>
                      setFormData((prev: any) => ({
                        ...prev,
                        eventType: "VIRTUAL",
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        {
                          color:
                            formData.eventType === "VIRTUAL"
                              ? textColor
                              : textVariantColor,
                        },
                      ]}
                    >
                      Virtual
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: textColor }]}>
                  Physical Address
                </Text>
                <View style={styles.inputWithIcon}>
                  <MaterialIcons
                    name="search"
                    size={20}
                    color={textVariantColor}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.pl10,
                      {
                        color: textColor,
                        borderColor: outlineColor,
                        backgroundColor: surfaceBright,
                      },
                    ]}
                    placeholder="Search for a venue or address..."
                    placeholderTextColor={textVariantColor}
                    value={formData.location}
                    onChangeText={(t) =>
                      setFormData((prev: any) => ({ ...prev, location: t }))
                    }
                  />
                </View>
                <Text style={[styles.helperText, { color: textVariantColor }]}>
                  This venue will host the regional swimming championships.
                </Text>
              </View>

              <View
                style={[
                  styles.mapPlaceholder,
                  {
                    backgroundColor: isDark ? "#2a2c31" : "#dce9ff",
                    borderColor: outlineColor,
                  },
                ]}
              >
                {formData.routeFile ? (
                  <View style={{ alignItems: "center" }}>
                    <MaterialIcons name="map" size={40} color={primaryColor} />
                    <Text
                      style={[
                        styles.mapPlaceholderText,
                        { color: textColor, marginTop: 8 },
                      ]}
                    >
                      {formData.routeFile.name}
                    </Text>
                    <Pressable
                      style={{
                        marginTop: 12,
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        backgroundColor: isDark ? "#444" : "#fff",
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: outlineColor,
                      }}
                      onPress={handleRouteUpload}
                    >
                      <Text
                        style={{
                          color: primaryColor,
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        Replace GPX File
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={{ alignItems: "center" }}>
                    <MaterialIcons
                      name="upload-file"
                      size={40}
                      color={textVariantColor}
                    />
                    <Text
                      style={[
                        styles.mapPlaceholderText,
                        {
                          color: textVariantColor,
                          marginBottom: 12,
                          marginTop: 8,
                        },
                      ]}
                    >
                      Upload GPX route file
                    </Text>
                    <Pressable
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        backgroundColor: primaryColor,
                        borderRadius: 6,
                      }}
                      onPress={handleRouteUpload}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Choose File
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>

            <View
              style={[
                styles.formCard,
                { backgroundColor: surfaceColor, borderColor: outlineColor },
              ]}
            >
              <Text
                style={[
                  styles.sectionHeading,
                  { color: textColor, marginBottom: 16 },
                ]}
              >
                Event Description
              </Text>

              <View style={styles.richTextContainer}>
                <View
                  style={[
                    styles.richTextToolbar,
                    {
                      backgroundColor: isDark ? "#33353a" : "#e5eeff",
                      borderColor: outlineColor,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="format-bold"
                    size={20}
                    color={textVariantColor}
                    style={styles.toolbarIcon}
                  />
                  <MaterialIcons
                    name="format-italic"
                    size={20}
                    color={textVariantColor}
                    style={styles.toolbarIcon}
                  />
                  <MaterialIcons
                    name="format-underlined"
                    size={20}
                    color={textVariantColor}
                    style={styles.toolbarIcon}
                  />
                  <View
                    style={[
                      styles.toolbarDivider,
                      { backgroundColor: outlineColor },
                    ]}
                  />
                  <MaterialIcons
                    name="format-list-bulleted"
                    size={20}
                    color={textVariantColor}
                    style={styles.toolbarIcon}
                  />
                  <MaterialIcons
                    name="link"
                    size={20}
                    color={textVariantColor}
                    style={styles.toolbarIcon}
                  />
                </View>
                <TextInput
                  style={[
                    styles.textArea,
                    styles.richTextArea,
                    {
                      color: textColor,
                      borderColor: outlineColor,
                      backgroundColor: surfaceBright,
                    },
                  ]}
                  placeholder="Describe the tournament schedule, pool rules, and spectator seating arrangements."
                  placeholderTextColor={textVariantColor}
                  multiline
                  numberOfLines={6}
                  value={formData.description}
                  onChangeText={(t) =>
                    setFormData((prev: any) => ({ ...prev, description: t }))
                  }
                />
              </View>
            </View>
          </View>
        )}
        {step === 3 && (
          <View>
            <View
              style={[
                styles.formCard,
                {
                  backgroundColor: surfaceColor,
                  borderColor: outlineColor,
                  marginBottom: 24,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderText}>
                  <Text style={[styles.sectionHeading, { color: textColor }]}>
                    Maximum Capacity
                  </Text>
                  <Text
                    style={[
                      styles.helperText,
                      { color: textVariantColor, marginTop: 4 },
                    ]}
                  >
                    Set a limit on the number of attendees to automatically
                    close registration when full.
                  </Text>
                </View>
                <MaterialIcons name="groups" size={28} color={primaryColor} />
              </View>

              <View
                style={[styles.inputGroup, { maxWidth: 300, marginBottom: 0 }]}
              >
                <View style={styles.inputWithIcon}>
                  <MaterialIcons
                    name="tag"
                    size={20}
                    color={textVariantColor}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.pl10,
                      {
                        color: textColor,
                        borderColor: outlineColor,
                        backgroundColor: surfaceBright,
                      },
                    ]}
                    placeholder="e.g. 150"
                    placeholderTextColor={textVariantColor}
                    keyboardType="numeric"
                    value={formData.maxAttendees}
                    onChangeText={(t) =>
                      setFormData((prev: any) => ({ ...prev, maxAttendees: t }))
                    }
                  />
                </View>
              </View>
            </View>

            <View
              style={[
                styles.formCard,
                { backgroundColor: surfaceColor, borderColor: outlineColor },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardHeaderText, { paddingRight: 32 }]}>
                  <Text style={[styles.sectionHeading, { color: textColor }]}>
                    Require Waiver
                  </Text>
                  <Text
                    style={[
                      styles.helperText,
                      { color: textVariantColor, marginTop: 4 },
                    ]}
                  >
                    Attendees must read and accept a waiver document before
                    completing registration.
                  </Text>
                </View>
                <Pressable
                  style={styles.toggleSwitch}
                  onPress={() =>
                    setFormData((prev: any) => ({
                      ...prev,
                      requireWaiver: !prev.requireWaiver,
                    }))
                  }
                >
                  <View
                    style={[
                      styles.toggleSwitchBg,
                      {
                        backgroundColor: formData.requireWaiver
                          ? primaryColor
                          : isDark
                            ? "#33353a"
                            : "#e5eeff",
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.toggleSwitchDot,
                      {
                        backgroundColor: surfaceColor,
                        transform: [
                          { translateX: formData.requireWaiver ? 20 : 2 },
                        ],
                      },
                    ]}
                  >
                    {formData.requireWaiver && (
                      <MaterialIcons
                        name="check"
                        size={14}
                        color={primaryColor}
                      />
                    )}
                  </View>
                </Pressable>
              </View>

              <View
                style={[
                  styles.uploadBox,
                  {
                    borderColor: outlineColor,
                    backgroundColor: surfaceBright,
                    opacity: formData.requireWaiver ? 1 : 0.4,
                  },
                ]}
              >
                <View
                  style={[
                    styles.uploadIconCircle,
                    { backgroundColor: isDark ? "#2a2c31" : "#dce9ff" },
                  ]}
                >
                  <MaterialIcons
                    name="upload-file"
                    size={28}
                    color={primaryColor}
                  />
                </View>
                <Text style={[styles.uploadTitle, { color: textColor }]}>
                  Click to upload or drag and drop
                </Text>
                <Text
                  style={[styles.uploadSubtitle, { color: textVariantColor }]}
                >
                  PDF, DOCX, or TXT (Max. 10MB)
                </Text>
                <View style={[styles.uploadBtn, { borderColor: outlineColor }]}>
                  <Text
                    style={[styles.uploadBtnText, { color: textVariantColor }]}
                  >
                    Select Document
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {step === 4 && (
          <View style={styles.gridContainer}>
            <View
              style={[
                styles.summaryCard,
                styles.fullWidthCard,
                { backgroundColor: surfaceColor, borderColor: outlineColor },
              ]}
            >
              <View style={styles.summaryCardHeader}>
                <Text style={[styles.summaryTitle, { color: textColor }]}>
                  {formData.eventName || "Untitled Event"}
                </Text>
                <Pressable onPress={() => setStep(1)}>
                  <MaterialIcons
                    name="edit"
                    size={20}
                    color={textVariantColor}
                  />
                </Pressable>
              </View>
              <Text
                style={[styles.summaryDescription, { color: textVariantColor }]}
              >
                {formData.description || "No description provided."}
              </Text>
              <View style={styles.chipRow}>
                <View
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isDark ? "#33353a" : "#e5eeff",
                      borderColor: outlineColor,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: textColor }]}>
                    {formData.eventType === "IN_PERSON"
                      ? "In-Person"
                      : "Virtual"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.rowGrid}>
              <View
                style={[
                  styles.summaryCard,
                  styles.halfWidth,
                  { backgroundColor: surfaceColor, borderColor: outlineColor },
                ]}
              >
                <View style={styles.summaryCardHeader}>
                  <View style={styles.summaryIconHeader}>
                    <MaterialIcons
                      name="calendar-month"
                      size={20}
                      color={primaryColor}
                    />
                    <Text
                      style={[styles.summaryLabel, { color: primaryColor }]}
                    >
                      Date & Time
                    </Text>
                  </View>
                  <Pressable onPress={() => setStep(1)}>
                    <MaterialIcons
                      name="edit"
                      size={20}
                      color={textVariantColor}
                    />
                  </Pressable>
                </View>
                <Text style={[styles.summaryValue, { color: textColor }]}>
                  {formData.dateStr || "TBD"}
                </Text>
                <Text
                  style={[styles.summarySubValue, { color: textVariantColor }]}
                >
                  {formData.startTime || "TBD"} - {formData.endTime || "TBD"}
                </Text>
              </View>

              <View
                style={[
                  styles.summaryCard,
                  styles.halfWidth,
                  { backgroundColor: surfaceColor, borderColor: outlineColor },
                ]}
              >
                <View style={styles.summaryCardHeader}>
                  <View style={styles.summaryIconHeader}>
                    <MaterialIcons
                      name="location-on"
                      size={20}
                      color={primaryColor}
                    />
                    <Text
                      style={[styles.summaryLabel, { color: primaryColor }]}
                    >
                      Location
                    </Text>
                  </View>
                  <Pressable onPress={() => setStep(2)}>
                    <MaterialIcons
                      name="edit"
                      size={20}
                      color={textVariantColor}
                    />
                  </Pressable>
                </View>
                <Text style={[styles.summaryValue, { color: textColor }]}>
                  {formData.location || "TBD"}
                </Text>
                <Text
                  style={[styles.summarySubValue, { color: textVariantColor }]}
                >
                  {formData.eventType}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.summaryCard,
                { backgroundColor: surfaceColor, borderColor: outlineColor },
              ]}
            >
              <View style={styles.summaryCardHeader}>
                <View style={styles.summaryIconHeader}>
                  <MaterialIcons name="groups" size={20} color={primaryColor} />
                  <Text style={[styles.summaryLabel, { color: primaryColor }]}>
                    Capacity & Registration
                  </Text>
                </View>
                <Pressable onPress={() => setStep(3)}>
                  <MaterialIcons
                    name="edit"
                    size={20}
                    color={textVariantColor}
                  />
                </Pressable>
              </View>

              <View style={styles.summaryList}>
                <View
                  style={[
                    styles.summaryListItem,
                    { borderBottomColor: outlineColor },
                  ]}
                >
                  <Text
                    style={[
                      styles.summaryListLabel,
                      { color: textVariantColor },
                    ]}
                  >
                    Athlete Capacity
                  </Text>
                  <Text style={[styles.summaryListValue, { color: textColor }]}>
                    {formData.maxAttendees || "Unlimited"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.summaryListItem,
                    { borderBottomColor: outlineColor, borderBottomWidth: 0 },
                  ]}
                >
                  <Text
                    style={[
                      styles.summaryListLabel,
                      { color: textVariantColor },
                    ]}
                  >
                    Waiver Required
                  </Text>
                  <Text style={[styles.summaryListValue, { color: textColor }]}>
                    {formData.requireWaiver ? "Yes" : "No"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor: surfaceColor, borderTopColor: outlineColor },
        ]}
      >
        <Pressable style={styles.footerBtn} onPress={handleSaveDraft}>
          <MaterialIcons
            name="save"
            size={24}
            color={textVariantColor}
            style={styles.footerBtnIcon}
          />
          <Text style={[styles.footerBtnText, { color: textVariantColor }]}>
            Save Draft
          </Text>
        </Pressable>

        {step === 4 ? (
          <Pressable
            style={[
              styles.footerBtn,
              styles.footerBtnPrimary,
              { backgroundColor: primaryColor },
            ]}
            onPress={handlePublish}
          >
            <MaterialIcons
              name="rocket-launch"
              size={24}
              color="#ffffff"
              style={styles.footerBtnIcon}
            />
            <Text style={[styles.footerBtnText, { color: "#ffffff" }]}>
              Publish Event
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={[
              styles.footerBtn,
              styles.footerBtnPrimary,
              { backgroundColor: primaryColor },
            ]}
            onPress={nextStep}
          >
            <MaterialIcons
              name="arrow-forward"
              size={24}
              color="#ffffff"
              style={styles.footerBtnIcon}
            />
            <Text style={[styles.footerBtnText, { color: "#ffffff" }]}>
              Continue
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    zIndex: 40,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 999,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  draftsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  draftsButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
    maxWidth: 700,
    alignSelf: "center",
    width: "100%",
  },
  progressHeader: {
    marginBottom: 40,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressPercentText: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 32,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputWithIcon: {
    position: "relative",
    justifyContent: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  pl10: {
    paddingLeft: 40,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  rowGrid: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: 24,
    marginBottom: 24,
  },
  halfWidth: {
    flex: 1,
  },
  checkboxContainer: {
    justifyContent: "center",
    paddingTop: Platform.OS === "web" ? 32 : 0,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  divider: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 12,
  },
  footerBtnPrimary: {
    marginLeft: 8,
  },
  footerBtnIcon: {
    marginBottom: 4,
  },
  footerBtnText: {
    fontSize: 12,
    fontWeight: "500",
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "600",
  },
  toggleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  toggleGroup: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 4,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  toggleBtnActive: {
    borderWidth: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
  },
  mapPlaceholder: {
    height: 180,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  mapPlaceholderText: {
    fontSize: 12,
    marginTop: 8,
  },
  richTextContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  richTextToolbar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    gap: 12,
  },
  toolbarIcon: {
    padding: 4,
  },
  toolbarDivider: {
    width: 1,
    height: 24,
  },
  richTextArea: {
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  cardHeaderText: {
    flex: 1,
    paddingRight: 16,
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    justifyContent: "center",
  },
  toggleSwitchBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  toggleSwitchDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    marginBottom: 16,
  },
  uploadBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  uploadBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  gridContainer: {
    gap: 24,
    marginBottom: 24,
  },
  summaryCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
  },
  fullWidthCard: {
    width: "100%",
  },
  summaryCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  summaryIconHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  summaryDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  summarySubValue: {
    fontSize: 14,
  },
  summaryList: {
    marginTop: 8,
  },
  summaryListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  summaryListLabel: {
    fontSize: 14,
  },
  summaryListValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successCard: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 24,
    borderWidth: 1,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 300,
    lineHeight: 24,
  },
  successBtnRow: {
    flexDirection:
      Platform.OS === "web" || Platform.OS === "ios" ? "row" : "column",
    gap: 16,
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  successBtn: {
    flex: 1,
    minWidth: 200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  successBtnPrimary: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  successBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sportGrid: {
    flexDirection: "row",
    gap: 12,
  },
  sportCard: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sportIcon: {
    marginBottom: 8,
  },
  sportLabel: {
    fontSize: 12,
  },
});
