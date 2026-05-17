import { MusicDashboard } from "@/features/music/ui/MusicDashboard";
import { useSession } from "@/features/session/model/useSession";
import { SafeAreaView } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";

export const HomePage = () => {
  const { user, signOut } = useSession();

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 32 }}>
      <YStack flex={1} padding="$4" gap="$4" backgroundColor="$background">
        <XStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap="$3"
        >
          <YStack flex={1} gap="$2" paddingBottom="$3">
            <Text fontSize={20} fontWeight="800">
              ¡Hola, {user?.email || "usuario"}!
            </Text>
            <Text color="#94A3B8" fontSize={13}>
              Bienvenido al panel de música personalizado.
            </Text>
          </YStack>
          <Button onPress={signOut} size="$4" theme="red">
            Cerrar sesión
          </Button>
        </XStack>

        <MusicDashboard />
      </YStack>
    </SafeAreaView>
  );
};
