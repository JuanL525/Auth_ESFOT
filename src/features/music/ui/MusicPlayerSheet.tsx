import { Song } from "@/features/music/model/types";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { Button, ScrollView, Sheet, Text, XStack, YStack } from "tamagui";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  song: Song | null;
  playbackUrl: string | null;
}

export const MusicPlayerSheet = ({
  open,
  onOpenChange,
  song,
  playbackUrl,
}: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Estados para simular el progreso
  const [progress, setProgress] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadSound = async () => {
      if (!playbackUrl || !open) return;
      setIsLoading(true);
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: playbackUrl },
          { shouldPlay: true },
        );
        if (!mounted) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying ?? false);
        }
      } catch {
        // silence; UI will remain visible
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadSound();

    return () => {
      mounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(false);
      setProgress(0); // Resetear progreso
    };
  }, [playbackUrl, open]);

  // Simulación de la barra de progreso
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && open) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, open]);

  const handleTogglePlayback = async () => {
    const sound = soundRef.current;
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if ("isLoaded" in status && status.isLoaded) {
      if (status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      modal
      dismissOnSnapToBottom
      snapPoints={[90]} // Forzar que ocupe el 90% de la pantalla para dar espacio
    >
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.7)" />
      <Sheet.Frame
        backgroundColor="#0F172A"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
        padding="$4"
        paddingBottom="$6"
      >
        {/* Header (Reemplaza al Handle predeterminado) */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
        >
          <Button
            size="$3"
            circular
            backgroundColor="transparent"
            onPress={() => onOpenChange(false)}
            icon={<FontAwesome name="chevron-down" size={20} color="#94A3B8" />}
          />
          <Text
            fontSize={12}
            fontWeight="800"
            color="#64748B"
            letterSpacing={1.5}
            textTransform="uppercase"
          >
            Reproduciendo ahora
          </Text>
          <Button
            size="$3"
            circular
            backgroundColor="transparent"
            icon={<FontAwesome name="ellipsis-h" size={20} color="#94A3B8" />}
          />
        </XStack>

        <YStack flex={1} gap="$4">
          {/* Carátula (Animación Lottie) - Altura fija para no comerse la pantalla */}
          <YStack
            height={180}
            backgroundColor="rgba(255, 255, 255, 0.03)"
            borderRadius="$8"
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.05)"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            <LottieView
              source={require("../../../../assets/animations/music.json")}
              autoPlay={isPlaying}
              loop
              style={{ width: 160, height: 160 }}
            />
          </YStack>

          {/* Información de la canción */}
          <YStack gap="$1">
            <Text
              fontSize={24}
              fontWeight="900"
              color="#F8FAFC"
              numberOfLines={1}
            >
              {song?.title || "Desconocido"}
            </Text>
            <Text fontSize={16} fontWeight="500" color="#818CF8">
              Música Local
            </Text>
          </YStack>

          {/* Barra de Progreso Simulada */}
          <YStack gap="$2" marginVertical="$2">
            <YStack
              height={4}
              backgroundColor="rgba(255, 255, 255, 0.1)"
              borderRadius="$2"
              overflow="hidden"
            >
              <YStack
                height="100%"
                backgroundColor="#F8FAFC"
                width={`${progress}%`}
              />
            </YStack>
            <XStack justifyContent="space-between">
              <Text fontSize={11} color="#64748B" fontWeight="600">
                {Math.floor(progress / 60)}:
                {Math.floor(progress % 60)
                  .toString()
                  .padStart(2, "0")}
              </Text>
              <Text fontSize={11} color="#64748B" fontWeight="600">
                -3:14
              </Text>
            </XStack>
          </YStack>

          {/* Controles de Reproducción */}
          <XStack
            justifyContent="center"
            alignItems="center"
            gap="$6"
            paddingVertical="$2"
          >
            <FontAwesome name="step-backward" size={24} color="#94A3B8" />

            <Button
              onPress={handleTogglePlayback}
              disabled={isLoading}
              width={64}
              height={64}
              borderRadius={32}
              backgroundColor="#6366f1"
              justifyContent="center"
              alignItems="center"
              pressStyle={{ scale: 0.95, backgroundColor: "#4f46e5" }}
            >
              <FontAwesome
                name={isLoading ? "spinner" : isPlaying ? "pause" : "play"}
                size={24}
                color="#F8FAFC"
                style={isLoading ? { transform: [{ rotate: "180deg" }] } : {}}
              />
            </Button>

            <FontAwesome name="step-forward" size={24} color="#94A3B8" />
          </XStack>

          {/* Letras Scrolleables (Glassmorphism) - Ahora sí ocupan el espacio restante */}
          <YStack
            flex={1}
            backgroundColor="rgba(255, 255, 255, 0.05)"
            borderRadius="$6"
            overflow="hidden"
          >
            <ScrollView
              flex={1}
              contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            >
              <Text
                color="#CBD5E1"
                textAlign="center"
                lineHeight={24}
                fontSize={15}
              >
                {song?.lyrics || "No hay letras disponibles para esta canción."}
              </Text>
            </ScrollView>
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
