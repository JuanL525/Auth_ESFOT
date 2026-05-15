import { QueryProvider } from "@/core/providers/QueryProvider";
import { useSession } from "@/features/session/model/useSession";
import { router, Stack, Href } from "expo-router";
import { useEffect } from "react";
 
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
    <QueryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Grupo de rutas de autenticación */}
        <Stack.Screen name="(auth)" />
        {/* Pantalla principal */}
        <Stack.Screen name="home"  />
        {/* Ruta índice: solo redirige, no muestra nada */}
        <Stack.Screen name="index" />
      </Stack>
      <AuthGuard />
    </QueryProvider>
  );
}
