import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator, Image, Pressable, StyleSheet } from "react-native";
import { useOrganizerTheme } from "@/constants/organizerTheme";

export interface PickedImage {
  uri: string;
  fileName: string;
  mimeType: string;
}

interface ImagePickerTileProps {
  uri?: string | null;
  onChange: (image: PickedImage) => void;
  loading?: boolean;
  size?: number;
}

export function ImagePickerTile({
  uri,
  onChange,
  loading,
  size = 54 + 20,
}: ImagePickerTileProps) {
  const t = useOrganizerTheme();

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    onChange({
      uri: asset.uri,
      fileName: asset.fileName ?? asset.uri.split("/").pop() ?? "logo.jpg",
      mimeType: asset.mimeType ?? "image/jpeg",
    });
  };

  return (
    <Pressable
      onPress={pick}
      disabled={loading}
      accessibilityLabel="Choose event logo"
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderColor: t.primary,
          backgroundColor: t.primaryTint,
        },
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <MaterialIcons
          name="add-photo-alternate"
          size={28}
          color={t.primaryDark}
        />
      )}
      {loading && (
        <ActivityIndicator style={styles.spinner} color={t.primaryDark} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  spinner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  image: { width: "100%", height: "100%" },
});
