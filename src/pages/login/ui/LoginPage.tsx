import { theme } from "@/core/styles/theme";
import { useLogin } from "@/features/auth/model/useLogin";
import { supabase } from "@/shared/api/supabase";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FontAwesome } from "@expo/vector-icons";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { Href, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Cargamos `makeRedirectUri` dinámicamente para evitar errores
// en entornos donde `expo-auth-session` no está instalado.
let makeRedirectUri: (opts?: any) => string;
try {
  makeRedirectUri = require("expo-auth-session").makeRedirectUri;
} catch (e) {
  makeRedirectUri = () => "";
}

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos requeridos", "Completa email y contraseña.");
      return;
    }
    try {
      await login.mutateAsync({ email, password });
      // La redirección ocurre automáticamente en _layout.tsx
      // cuando la sesión cambia y AuthGuard detecta isAuthenticated=true
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Credenciales incorrectas.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Generar redirectUri usando el esquema de la app (definido en app.json)
      const redirectUrl = makeRedirectUri({ scheme: "authesfot" });

      // Mostrar la URL exacta para que la registres en Supabase
      console.log("REGISTRA ESTA URL EN SUPABASE:", redirectUrl);

      // Pedimos a Supabase la URL de autorización para Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: "select_account",
          },
        },
      } as any);

      if (error) {
        Alert.alert(
          "Error",
          error.message ?? "No se pudo iniciar Google OAuth",
        );
        return;
      }

      const url = (data as any)?.url;
      if (!url) {
        Alert.alert("Error", "No se pudo obtener la URL de autorización.");
        return;
      }

      // Abrir el navegador y esperar a que redirija de vuelta a la app
      const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl);

      if (result.type === "success") {
        const callbackUrl = result.url;
        const parsedUrl = callbackUrl.includes("#")
          ? callbackUrl.replace("#", "?")
          : callbackUrl;
        const { params } = QueryParams.getQueryParams(parsedUrl);

        if (params?.access_token && params?.refresh_token) {
          await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
        }
      } else if (result.type === "dismiss") {
        Alert.alert("Cancelado", "Flujo de Google cancelado.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Error en OAuth de Google.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🔐</Text>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>ESFOT — Inicia sesión</Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <Input
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="tu@correo.com"
            />
            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Tu contraseña"
            />
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password" as Href)}
              style={{ alignSelf: "flex-end" }}
            >
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <Button
              onPress={handleLogin}
              isLoading={login.isPending}
              label="Iniciar sesión"
            />
            <View style={{ alignItems: "center", marginVertical: 12 }}>
              <Text style={{ color: theme.colors.textMuted }}>
                O continuar con
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleGoogleSignIn}
              activeOpacity={0.85}
              style={styles.googleBtn}
            >
              <FontAwesome name="google" size={18} color="#DB4437" />
              <Text style={styles.googleBtnLabel}>Continuar con Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register" as Href)}
              style={{ alignItems: "center" }}
            >
              <Text style={styles.linkMuted}>
                ¿No tienes cuenta?{" "}
                <Text
                  style={{ color: theme.colors.primary, fontWeight: "700" }}
                >
                  Regístrate
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    overflow: "hidden",
    ...theme.shadow.card,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 32,
    alignItems: "center",
  },
  logo: { fontSize: 52, marginBottom: 12 },
  title: { color: "#fff", fontSize: 26, fontWeight: "700", marginBottom: 4 },
  subtitle: { color: "rgba(255,255,255,0.75)", fontSize: 14 },
  form: { padding: 28, gap: 16 },
  link: { color: theme.colors.accent, fontSize: 14 },
  linkMuted: { color: theme.colors.textMuted, fontSize: 14 },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    gap: 10,
  },
  googleBtnLabel: {
    color: "#111827",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
});
