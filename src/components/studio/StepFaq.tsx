import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useOrganizerTheme } from "@/constants/organizerTheme";
import type { FAQ } from "@/models/event";
import { FieldLabel } from "./FieldLabel";
import { FormSection } from "./FormSection";
import { TextField } from "./TextField";

interface StepFaqProps {
  faqs: FAQ[];
  onChange: (faqs: FAQ[]) => void;
}

export function StepFaq({ faqs, onChange }: StepFaqProps) {
  const t = useOrganizerTheme();
  const [expanded, setExpanded] = useState<number | null>(null);

  const update = (index: number, patch: Partial<FAQ>) =>
    onChange(faqs.map((f, i) => (i === index ? { ...f, ...patch } : f)));

  const remove = (index: number) => {
    onChange(faqs.filter((_, i) => i !== index));
    setExpanded(null);
  };

  const done = (index: number) => {
    const faq = faqs[index];
    if (!faq.question.trim() && !faq.answer.trim()) {
      remove(index);
      return;
    }
    setExpanded(null);
  };

  const add = () => {
    onChange([...faqs, { question: "", answer: "" }]);
    setExpanded(faqs.length);
  };

  return (
    <FormSection
      title="FAQ"
      subtitle="Answer common questions before attendees ask. Optional."
    >
      <View style={styles.list}>
        {faqs.map((faq, i) =>
          expanded === i ? (
            <View
              key={i}
              style={[
                styles.card,
                styles.cardOpen,
                { backgroundColor: t.surface, borderColor: t.primary },
              ]}
            >
              <FieldLabel label="Question" />
              <TextField
                value={faq.question}
                onChangeText={(question) => update(i, { question })}
                placeholder="e.g. Is parking available?"
              />
              <FieldLabel label="Answer" />
              <TextField
                value={faq.answer}
                onChangeText={(answer) => update(i, { answer })}
                placeholder="Your answer"
                multiline
                textAlignVertical="top"
                style={styles.answer}
              />
              <View style={styles.actions}>
                <Pressable
                  onPress={() => remove(i)}
                  accessibilityRole="button"
                  accessibilityLabel="Delete question"
                  style={styles.delete}
                >
                  <MaterialIcons name="delete" size={22} color={t.danger} />
                  <Text style={[styles.deleteText, { color: t.danger }]}>
                    Delete
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => done(i)}
                  accessibilityRole="button"
                  style={[styles.done, { backgroundColor: t.primaryTint }]}
                >
                  <Text style={[styles.doneText, { color: t.primaryDark }]}>
                    Done
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              key={i}
              onPress={() => setExpanded(i)}
              accessibilityRole="button"
              style={[
                styles.card,
                styles.row,
                { backgroundColor: t.surface, borderColor: t.border },
              ]}
            >
              <MaterialIcons
                name="drag-indicator"
                size={22}
                color={t.placeholder}
              />
              <Text
                numberOfLines={1}
                style={[styles.question, { color: t.text }]}
              >
                {faq.question || "Untitled question"}
              </Text>
              <MaterialIcons
                name="expand-more"
                size={26}
                color={t.textMuted}
              />
            </Pressable>
          ),
        )}
        <Pressable
          onPress={add}
          accessibilityRole="button"
          style={[styles.add, { borderColor: t.border }]}
        >
          <MaterialIcons name="add" size={24} color={t.primaryDark} />
          <Text style={[styles.addText, { color: t.primaryDark }]}>
            Add question
          </Text>
        </Pressable>
      </View>
    </FormSection>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12 },
  card: { borderWidth: 1, borderRadius: 18 },
  cardOpen: { padding: 16, paddingTop: 0 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  question: { flex: 1, fontSize: 18, fontWeight: "600" },
  answer: { height: 100, paddingTop: 14 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  delete: { flexDirection: "row", alignItems: "center", gap: 8 },
  deleteText: { fontSize: 17, fontWeight: "600" },
  done: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  doneText: { fontSize: 17, fontWeight: "700" },
  add: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 72,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 18,
  },
  addText: { fontSize: 18, fontWeight: "700" },
});
