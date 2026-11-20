import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const VAULT_KEY = "hero_license_token";

export default function EncryptedVaultDemo() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");
  const [vaultValue, setVaultValue] = useState<string | null>(null);
  const [status, setStatus] = useState("No token found in storage.");

  const saveToken = async () => {
    if (!tokenInput.trim()) return;
    if (Platform.OS === "web") {
      localStorage.setItem(VAULT_KEY, tokenInput);
      setStatus("Token saved to localStorage.");
    } else {
      await SecureStore.setItemAsync(VAULT_KEY, tokenInput);
      setStatus("Token encrypted & saved to SecureStore.");
    }
    setTokenInput("");
  };

  const loadToken = async () => {
    const value =
      Platform.OS === "web"
        ? localStorage.getItem(VAULT_KEY)
        : await SecureStore.getItemAsync(VAULT_KEY);

    if (value) {
      setVaultValue(value);
      setStatus(
        Platform.OS === "web"
          ? "Token loaded from localStorage."
          : "Token decrypted from SecureStore.",
      );
    } else {
      setVaultValue(null);
      setStatus("No token found in storage.");
    }
  };

  const wipeToken = async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem(VAULT_KEY);
    } else {
      await SecureStore.deleteItemAsync(VAULT_KEY);
    }
    setVaultValue(null);
    setStatus("Token wiped from storage.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Encrypted Vault Demo</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            Platform:{" "}
            {Platform.OS === "web"
              ? "Web Browser (localStorage)"
              : "Mobile (Expo SecureStore)"}
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter Hero License Token..."
          placeholderTextColor="#666"
          value={tokenInput}
          onChangeText={setTokenInput}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={saveToken}>
          <Text style={styles.primaryBtnText}>Save Token</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={loadToken}>
          <Text style={styles.secondaryBtnText}>Load Token</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={wipeToken}>
          <Text style={styles.secondaryBtnText}>Wipe Token</Text>
        </TouchableOpacity>

        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        {vaultValue && (
          <View style={styles.valueBox}>
            <Text style={styles.valueLabel}>VAULT VALUE</Text>
            <Text style={styles.valueText}>{vaultValue}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Kembali ke Command HQ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#0d0d0d",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#222",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "center",
    backgroundColor: "#181818",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#262626",
  },
  badgeText: { color: "#aaa", fontSize: 11 },
  input: {
    backgroundColor: "#141414",
    color: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 14,
  },
  primaryBtn: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryBtnText: { color: "#000", fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: "#141414",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  secondaryBtnText: { color: "#fff", fontWeight: "600" },
  statusBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
  },
  statusText: { color: "#888", fontSize: 12, textAlign: "center" },
  valueBox: {
    marginTop: 10,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  valueLabel: {
    color: "#777",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
  },
  valueText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  backBtn: { marginTop: 16, alignItems: "center", padding: 10 },
  backBtnText: { color: "#888", fontSize: 12, fontWeight: "600" },
});
