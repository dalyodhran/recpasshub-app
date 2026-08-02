import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";

import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { ListItem } from "@/components/ui/ListItem";
import { styles } from "@/styles/profile.styles";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <View style={styles.safeArea}>
      <ScreenHeader
        title="Rec Pass Hub"
        rightIcon="notifications"
        onRightPress={() => router.push("/notifications")}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileBackground} />

          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVFj8oUmFCK_uilpnM6jxzv3ZbjyEGjyEedgEqBaPJy2p_-svWb11Si09BjT1bwwCD62mgGCDA6hpR7y4qixaEDHZxMkLm5LSxyDSMvYLFx46Ttu_boRD8KTub8dk_9cG5BVoUCD3KXB2s8KO0GNTSgUFQ3BhrcPgw-bMo9FuUFZFVMTxeC1ew-7uFNxr0Fn06po4qG_2EKW127NtLJMdTL2J7Tnbetke3tda7fYEuOnQlbjL4pgMdWg",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <MaterialIcons name="edit" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || "Alex Johnson"}</Text>
          <View style={styles.badge}>
            <MaterialIcons name="verified" size={14} color="#b75b00" />
            <Text style={styles.badgeText}>PRO MEMBER</Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          {/* Account Section */}
          <SectionCard title="ACCOUNT">
            <ListItem
              icon="person-outline"
              title="Personal Information"
              showChevron
              onPress={() => {}}
            />
            <ListItem
              icon="lock-outline"
              title="Change Password"
              showChevron
              hideDivider
              onPress={() => {}}
            />
          </SectionCard>

          {/* Preferences Section */}
          <SectionCard title="PREFERENCES">
            <ListItem
              icon="straighten"
              title="Measurement Units"
              rightElement={
                <View style={styles.toggleGroup}>
                  <TouchableOpacity
                    style={[styles.toggleBtn, styles.toggleBtnActive]}
                  >
                    <Text style={styles.toggleBtnTextActive}>Metric</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toggleBtn}>
                    <Text style={styles.toggleBtnText}>Imperial</Text>
                  </TouchableOpacity>
                </View>
              }
            />
            <ListItem
              icon="location-on"
              title="Local Feed Region"
              showChevron
              onPress={() => {}}
              rightElement={
                <Text style={styles.listItemValueText}>San Francisco, CA</Text>
              }
            />
            <ListItem
              icon="directions-run"
              title="Default Activity"
              showChevron
              hideDivider
              onPress={() => {}}
              rightElement={
                <Text style={styles.listItemValueText}>Running</Text>
              }
            />
          </SectionCard>

          {/* Notifications Section */}
          <SectionCard title="NOTIFICATIONS">
            <ListItem
              icon="smartphone"
              title="Push Notifications"
              rightElement={
                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  trackColor={{ false: "#e0e3e5", true: "#0058be" }}
                  thumbColor={"#ffffff"}
                />
              }
            />
            <ListItem
              icon="mail"
              title="Email Updates"
              hideDivider
              rightElement={
                <Switch
                  value={emailEnabled}
                  onValueChange={setEmailEnabled}
                  trackColor={{ false: "#e0e3e5", true: "#0058be" }}
                  thumbColor={"#ffffff"}
                />
              }
            />
          </SectionCard>

          {/* About & Support Section */}
          <SectionCard>
            <ListItem
              icon="help-outline"
              title="Help Center"
              showChevron
              onPress={() => {}}
            />
            <ListItem
              icon="policy"
              title="Privacy Policy"
              showChevron
              onPress={() => {}}
            />
            <ListItem
              title="Log Out"
              destructive
              hideDivider
              onPress={logout}
            />
          </SectionCard>
        </View>
      </ScrollView>
    </View>
  );
}
