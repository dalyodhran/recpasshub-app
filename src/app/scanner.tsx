import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const BOX_SIZE = 250;

export default function CheckInScanner() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [torchEnabled, setTorchEnabled] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const primaryColor = isDark ? "#f59e0b" : "#d97706";
  const surfaceColor = isDark ? "#1e1e1e" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#0b1c30";
  const textVariantColor = isDark ? "#a0a4ab" : "#554336";
  const outlineColor = isDark ? "#33353a" : "#dbc2b0";

  useEffect(() => {
    // Loop the scanning line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scanLineAnim]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: surfaceColor },
        ]}
      >
        <Text style={[styles.title, { color: textColor }]}>
          We need your permission to show the camera
        </Text>
        <Pressable
          style={[styles.btn, { backgroundColor: primaryColor }]}
          onPress={requestPermission}
        >
          <Text style={styles.btnText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250], // approx height of the scanner box
  });

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torchEnabled}
      />
      {/* Overlay Backdrop */}

      {/* Floating UI Elements over Camera */}
      <SafeAreaView style={[styles.safeArea]} pointerEvents="box-none">
        {/* Top Actions */}
        <View style={styles.topActions}>
          <Pressable style={styles.actionBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            onPress={() => setTorchEnabled(!torchEnabled)}
          >
            <MaterialIcons
              name={torchEnabled ? "flashlight-on" : "flashlight-off"}
              size={24}
              color="#ffffff"
            />
          </Pressable>
        </View>

        <View style={styles.overlayWrapper} pointerEvents="none">
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlayLeft} />
            <View style={styles.centerBox}>
              {/* Corner Borders */}
              <View
                style={[
                  styles.corner,
                  styles.topLeft,
                  { borderColor: primaryColor },
                ]}
              />
              <View
                style={[
                  styles.corner,
                  styles.topRight,
                  { borderColor: primaryColor },
                ]}
              />
              <View
                style={[
                  styles.corner,
                  styles.bottomLeft,
                  { borderColor: primaryColor },
                ]}
              />
              <View
                style={[
                  styles.corner,
                  styles.bottomRight,
                  { borderColor: primaryColor },
                ]}
              />

              {/* Animated Scan Line */}
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    backgroundColor: primaryColor,
                    transform: [{ translateY: scanLineTranslateY }],
                  },
                ]}
              />
            </View>
            <View style={styles.overlayRight} />
          </View>
          <View style={styles.overlayBottom} />
        </View>

        {/* Bottom Instruction Card */}
        <View
          style={[
            styles.bottomCard,
            { backgroundColor: surfaceColor, borderColor: outlineColor },
          ]}
        >
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: isDark ? "#333" : "#f2f4f6" },
            ]}
          >
            <MaterialIcons
              name="qr-code-scanner"
              size={32}
              color={primaryColor}
            />
          </View>
          <Text style={[styles.cardTitle, { color: textColor }]}>
            Scan Pass
          </Text>
          <Text style={[styles.cardText, { color: textVariantColor }]}>
            Position the attendee's QR code within the frame to automatically
            check them in.
          </Text>

          <Pressable style={styles.ghostBtn}>
            <Text style={[styles.ghostBtnText, { color: primaryColor }]}>
              Enter Manually
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  btn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  overlayWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTop: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  overlayMiddle: {
    flexDirection: "row",
    height: BOX_SIZE,
    width: "100%",
  },
  overlayBottom: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  overlayLeft: {
    flex: 1,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  overlayRight: {
    flex: 1,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  centerBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: "transparent",
  },
  corner: {
    position: "absolute",
    width: 32,
    height: 32,
    borderWidth: 0,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    width: "100%",
    shadowColor: "#d97706",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  pulseText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomCard: {
    margin: 16,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  ghostBtn: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
  },
  ghostBtnText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
