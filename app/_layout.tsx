import { QueryProvider } from "@/core/providers/QueryProvider";
import { useSession } from "@/features/session/model/useSession";
import { Href, router, Stack } from "expo-router";
import { useEffect } from "react";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";

// Componente interno que maneja la redirección basada en auth.
// Está dentro de QueryProvider para poder usar useSession.
function AuthGuard() {
  const { isAuthenticated, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) return; // Esperar a que se cargue la sesión

    if (isAuthenticated) {
      // Usuario autenticado → ir a la pantalla principal
      router.replace("/home" as Href);
    } else {
      // Sin sesión → ir al login
      router.replace("/(auth)/login" as Href);
    }
  }, [isAuthenticated, isLoading]);

  return null; // Este componente no renderiza nada, solo navega
}

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Grupo de rutas de autenticación */}
          <Stack.Screen name="(auth)" />
          {/* Pantalla principal */}
          <Stack.Screen name="home" />
          {/* Ruta índice: solo redirige, no muestra nada */}
          <Stack.Screen name="index" />
        </Stack>
        <AuthGuard />
      </QueryProvider>
    </TamaguiProvider>
  );
}
