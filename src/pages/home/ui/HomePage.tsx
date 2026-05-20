import { MusicDashboard } from "@/features/music/ui/MusicDashboard";
import { useSession } from "@/features/session/model/useSession";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Sheet, Text, XStack, YStack } from "tamagui";

export const HomePage = () => {
  const { user, signOut } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    setIsMenuOpen(false);
    signOut();
  };

  const menuOptions = [
    { icon: "user", label: "Cuenta" },
    { icon: "cog", label: "Configuración" },
    { icon: "info-circle", label: "Acerca de" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0F172A" }}>
      <YStack flex={1} backgroundColor="#0F172A">
        {/* Navbar */}
        <XStack
          height={56}
          backgroundColor="#0F172A"
          borderBottomWidth={1}
          borderBottomColor="rgba(255, 255, 255, 0.05)"
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="$4"
        >
          <Button
            circular
            size="$3"
            backgroundColor="transparent"
            borderWidth={0}
            onPress={() => setIsMenuOpen(true)}
            icon={<FontAwesome name="bars" size={20} color="#818CF8" />}
            pressStyle={{
              backgroundColor: "rgba(129, 140, 248, 0.1)",
            }}
          />

          <Button
            circular
            size="$3"
            backgroundColor="transparent"
            borderWidth={0}
            icon={<FontAwesome name="user-circle" size={20} color="#818CF8" />}
            pressStyle={{
              backgroundColor: "rgba(129, 140, 248, 0.1)",
            }}
          />
        </XStack>

        {/* Contenido principal */}
        <YStack flex={1}>
          <MusicDashboard />
        </YStack>
      </YStack>

      {/* Menú Hamburguesa - Sheet */}
      <Sheet
        modal
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        snapPoints={[85]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame
          backgroundColor="#0F172A"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
          padding="$4"
          gap="$4"
        >
          {/* Header del Menú */}
          <YStack gap="$3" alignItems="center" paddingBottom="$2">
            {/* Avatar Decorativo */}
            <YStack
              width={64}
              height={64}
              borderRadius="$4"
              backgroundColor="rgba(99, 102, 241, 0.2)"
              alignItems="center"
              justifyContent="center"
              borderWidth={2}
              borderColor="#6366F1"
            >
              <FontAwesome name="user" size={32} color="#818CF8" />
            </YStack>

            {/* Saludo */}
            <Text
              fontSize={18}
              fontWeight="700"
              color="#F8FAFC"
              textAlign="center"
            >
              ¡Hola, {user?.email?.split("@")[0] || "usuario"}!
            </Text>
            <Text fontSize={13} color="#94A3B8">
              Panel de control
            </Text>
          </YStack>

          {/* Opciones de Menú */}
          <YStack gap="$2" paddingVertical="$3">
            {menuOptions.map((option) => (
              <Button
                key={option.label}
                backgroundColor="rgba(255, 255, 255, 0.05)"
                borderWidth={0}
                paddingHorizontal="$4"
                paddingVertical="$3"
                justifyContent="flex-start"
                height="auto"
                pressStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <XStack gap="$3" alignItems="center" width="100%">
                  <FontAwesome
                    name={option.icon as any}
                    size={18}
                    color="#818CF8"
                  />
                  <Text color="#F8FAFC" fontWeight="500" flex={1}>
                    {option.label}
                  </Text>
                </XStack>
              </Button>
            ))}
          </YStack>

          {/* Separador */}
          <YStack
            height={1}
            backgroundColor="rgba(255, 255, 255, 0.05)"
            marginVertical="$2"
          />

          {/* Botón Cerrar Sesión */}
          <Button
            onPress={handleSignOut}
            width="100%"
            height="auto"
            backgroundColor="rgba(239, 68, 68, 0.1)"
            borderWidth={1}
            borderColor="rgba(239, 68, 68, 0.3)"
            paddingVertical="$4"
            justifyContent="center"
            pressStyle={{
              backgroundColor: "rgba(239, 68, 68, 0.2)",
            }}
          >
            <XStack gap="$3" alignItems="center">
              <FontAwesome name="sign-out" size={18} color="#EF4444" />
              <Text color="#EF4444" fontWeight="700" fontSize={16}>
                Cerrar sesión
              </Text>
            </XStack>
          </Button>
        </Sheet.Frame>
      </Sheet>
    </SafeAreaView>
  );
};