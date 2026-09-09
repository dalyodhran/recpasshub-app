import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useIsFocused } from "expo-router/react-navigation";
import { useEventContext } from "@/context/event-context";
import { FAQ } from "@/models/event";
import EmptyEventState from "@/components/ui/EmptyEventState";
import { useAuth } from "@/auth/AuthContext";
import { resolveDisplayLocation } from "@/api/map/mapService";

import { EventHeroScreen } from "@/components/EventHeroScreen";

export default function EditEvent() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { authService } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const { selectedEvent, events, updateEventDetails } = useEventContext();

  const [eventName, setEventName] = useState(selectedEvent?.eventName || "");
  const [description, setDescription] = useState(
    selectedEvent?.description || "",
  );
  const [faqs, setFaqs] = useState<FAQ[]>(
    selectedEvent?.frequentlyAskedQuestions || [],
  );
  const [dateStr, setDateStr] = useState(
    selectedEvent?.startDateTime
      ? new Date(selectedEvent.startDateTime).toLocaleDateString()
      : "",
  );
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState<string>("0.0");
  const [elevation, setElevation] = useState<string>("0");
  const [s3FileLocation, setS3FileLocation] = useState<string>("");
  const [rawDistanceKm, setRawDistanceKm] = useState<number | undefined>(
    undefined,
  );
  const [rawElevationM, setRawElevationM] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    setEventName(selectedEvent?.eventName || "");
    setDescription(selectedEvent?.description || "");
    setDateStr(
      selectedEvent?.startDateTime
        ? new Date(selectedEvent.startDateTime).toLocaleDateString()
        : "",
    );
    setFaqs(selectedEvent?.frequentlyAskedQuestions || []);
    setLocation("");
    setDistance("0.0");
    setElevation("0");
    setS3FileLocation("");
    setRawDistanceKm(undefined);
    setRawElevationM(undefined);
  }, [selectedEvent]);

  useEffect(() => {
    const applyMapMetadata = async () => {
      const mapData = selectedEvent?.map;
      if (mapData && !location) {
        try {
          const resolvedLocation = await resolveDisplayLocation(
            mapData.location,
          );
          setLocation(resolvedLocation);

          if (mapData.distance != null) {
            setRawDistanceKm(mapData.distance / 1000);
            setDistance((mapData.distance / 1000).toFixed(1));
          }
          if (mapData.elevation != null) {
            setRawElevationM(mapData.elevation);
            setElevation(Math.round(mapData.elevation).toString());
          }
          if (mapData.s3FileLocation) {
            setS3FileLocation(mapData.s3FileLocation);
          }
        } catch (err) {
          console.error("Failed to apply map metadata in edit", err);
        }
      }
    };
    applyMapMetadata();
  }, [selectedEvent?.map, location]);

  const handleUpdateFaq = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleRemoveFaq = (index: number) => {
    const newFaqs = [...faqs];
    newFaqs.splice(index, 1);
    setFaqs(newFaqs);
  };

  const handlePublishChanges = async () => {
    if (selectedEvent) {
      await updateEventDetails({
        ...selectedEvent,
        eventName,
        description: description,
        frequentlyAskedQuestions: faqs,
        state: "PUBLISHED",
      });
    }
    router.push(`/studio?id=${selectedEvent?.eventGuid || ""}&step=5`);
  };

  const handleMapSave = async (
    mapGuid: string,
    newDistance: number,
    newElevation: number,
  ) => {
    setDistance(newDistance.toFixed(1));
    setElevation(Math.round(newElevation).toString());
    if (selectedEvent) {
      await updateEventDetails({
        ...selectedEvent,
        mapGuid,
      });
    }
  };

  const primaryColor = isDark ? "#f59e0b" : "#d97706";
  const bgColor = isDark ? "#121212" : "#f8f9ff";
  const surfaceColor = isDark ? "#1e1e1e" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#0b1c30";
  const textVariantColor = isDark ? "#a0a4ab" : "#554336";
  const outlineColor = isDark ? "#33353a" : "#dbc2b0";

  if (events.length === 0 || !selectedEvent) {
    return (
      <EmptyEventState
        title="No Event to Edit"
        message="You don't have any events yet. Create one to start managing your details."
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: bgColor }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Interactive Hero Map Screen (Lazy Loaded) */}
        {isFocused ? (
          <EventHeroScreen
            onMapSave={handleMapSave}
            s3FileLocation={s3FileLocation}
            s3DistanceKm={rawDistanceKm}
            s3ElevationGainM={rawElevationM}
          />
        ) : (
          <View style={styles.heroContainer} />
        )}

        <View style={styles.contentContainer}>
          {/* Main Edit Form */}
          <View
            style={[
              styles.headerCard,
              { backgroundColor: surfaceColor, borderColor: outlineColor },
            ]}
          >
            <View style={[styles.badge, { backgroundColor: primaryColor }]}>
              <Text style={styles.badgeText}>
                {selectedEvent?.state || "DRAFT"}
              </Text>
            </View>
            <TextInput
              style={[
                styles.titleInput,
                {
                  color: textColor,
                  borderColor: outlineColor,
                  backgroundColor: bgColor,
                },
              ]}
              value={eventName}
              onChangeText={setEventName}
            />

            <View style={styles.inputRow}>
              <MaterialIcons
                name="calendar-today"
                size={20}
                color={textVariantColor}
              />
              <TextInput
                style={[
                  styles.rowInput,
                  {
                    color: textVariantColor,
                    borderColor: outlineColor,
                    backgroundColor: bgColor,
                  },
                ]}
                value={dateStr}
                onChangeText={setDateStr}
              />
            </View>

            <View style={styles.inputRow}>
              <MaterialIcons
                name="location-on"
                size={20}
                color={textVariantColor}
              />
              <TextInput
                style={[
                  styles.rowInput,
                  {
                    color: textVariantColor,
                    borderColor: outlineColor,
                    backgroundColor: bgColor,
                  },
                ]}
                value={location}
                onChangeText={setLocation}
                placeholder="Location"
                placeholderTextColor={textVariantColor}
              />
            </View>
          </View>

          {/* Stats Grid */}
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Event Details
          </Text>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statBox,
                { backgroundColor: surfaceColor, borderColor: outlineColor },
              ]}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: `${primaryColor}1A` },
                ]}
              >
                <MaterialIcons
                  name="straighten"
                  size={24}
                  color={primaryColor}
                />
              </View>
              <Text style={[styles.statLabel, { color: textVariantColor }]}>
                Distance
              </Text>
              <Text style={[styles.statValue, { color: textColor }]}>
                {`${distance} km`}
              </Text>
            </View>
            <View
              style={[
                styles.statBox,
                { backgroundColor: surfaceColor, borderColor: outlineColor },
              ]}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: `${primaryColor}1A` },
                ]}
              >
                <MaterialIcons
                  name="trending-up"
                  size={24}
                  color={primaryColor}
                />
              </View>
              <Text style={[styles.statLabel, { color: textVariantColor }]}>
                Elevation
              </Text>
              <Text style={[styles.statValue, { color: textColor }]}>
                {`${elevation} m`}
              </Text>
            </View>
            <View
              style={[
                styles.statBox,
                { backgroundColor: surfaceColor, borderColor: outlineColor },
              ]}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: `${primaryColor}1A` },
                ]}
              >
                <MaterialIcons name="timer" size={24} color={primaryColor} />
              </View>
              <Text style={[styles.statLabel, { color: textVariantColor }]}>
                Target Pace
              </Text>
              <Text style={[styles.statValue, { color: textColor }]}>
                5:30/km
              </Text>
            </View>
            <View
              style={[
                styles.statBox,
                { backgroundColor: surfaceColor, borderColor: outlineColor },
              ]}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: `${primaryColor}1A` },
                ]}
              >
                <MaterialIcons name="group" size={24} color={primaryColor} />
              </View>
              <Text style={[styles.statLabel, { color: textVariantColor }]}>
                Capacity
              </Text>
              <Text style={[styles.statValue, { color: textColor }]}>
                5 / {selectedEvent?.capacity || 0}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                color: textVariantColor,
                borderColor: outlineColor,
                backgroundColor: surfaceColor,
              },
            ]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
            placeholder="Event description..."
          />

          {/* FAQs */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 24,
              marginBottom: 12,
            }}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: textColor, marginBottom: 0 },
              ]}
            >
              FAQs
            </Text>
            {faqs.length > 0 && (
              <Pressable onPress={handleAddFaq} style={{ padding: 4 }}>
                <Text style={{ color: primaryColor, fontWeight: "bold" }}>
                  + Add FAQ
                </Text>
              </Pressable>
            )}
          </View>

          {faqs.length > 0 ? (
            <View
              style={[
                styles.faqContainer,
                { backgroundColor: surfaceColor, borderColor: outlineColor },
              ]}
            >
              {faqs.map((faq, index) => (
                <View
                  key={index}
                  style={[
                    styles.faqItem,
                    { borderBottomColor: outlineColor },
                    index === faqs.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: textVariantColor,
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      FAQ {index + 1}
                    </Text>
                    <Pressable
                      onPress={() => handleRemoveFaq(index)}
                      style={{ padding: 4 }}
                    >
                      <MaterialIcons name="close" size={16} color="#ef4444" />
                    </Pressable>
                  </View>
                  <TextInput
                    style={[
                      styles.faqQuestion,
                      {
                        color: textColor,
                        borderColor: outlineColor,
                        backgroundColor: bgColor,
                      },
                    ]}
                    value={faq.question}
                    onChangeText={(val) =>
                      handleUpdateFaq(index, "question", val)
                    }
                    placeholder="Question"
                  />
                  <TextInput
                    style={[
                      styles.faqAnswer,
                      {
                        color: textVariantColor,
                        borderColor: outlineColor,
                        backgroundColor: bgColor,
                      },
                    ]}
                    multiline
                    value={faq.answer}
                    onChangeText={(val) =>
                      handleUpdateFaq(index, "answer", val)
                    }
                    placeholder="Answer"
                  />
                </View>
              ))}
            </View>
          ) : (
            <Pressable
              style={{
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: outlineColor,
                borderRadius: 12,
                padding: 24,
                alignItems: "center",
              }}
              onPress={handleAddFaq}
            >
              <MaterialIcons
                name="add-circle-outline"
                size={32}
                color={primaryColor}
                style={{ marginBottom: 8 }}
              />
              <Text style={{ color: primaryColor, fontWeight: "bold" }}>
                Add your first FAQ
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: surfaceColor, borderTopColor: outlineColor },
        ]}
      >
        <Pressable
          style={[styles.saveBtn, { backgroundColor: primaryColor }]}
          onPress={handlePublishChanges}
        >
          <Text style={styles.saveBtnText}>Publish Changes</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    height: 300,
    width: "100%",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 16,
    marginTop: -32,
  },
  headerCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rowInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statBox: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
  },
  faqContainer: {
    borderRadius: 12,
    borderWidth: 1,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  faqAnswer: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 80,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
