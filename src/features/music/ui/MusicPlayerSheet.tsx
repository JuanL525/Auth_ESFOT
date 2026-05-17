import { Song } from "@/features/music/model/types";
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
    };
  }, [playbackUrl, open]);

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
    <Sheet open={open} onOpenChange={onOpenChange} modal dismissOnSnapToBottom>
      <Sheet.Overlay />
      <Sheet.Frame
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
        padding="$4"
        paddingBottom="$8"
      >
        <Sheet.Handle marginBottom="$4" />
        <YStack flex={1} gap="$4">
          <YStack gap="$2">
            <Text fontSize={18} fontWeight="800">
              Reproduciendo ahora
            </Text>
            <Text fontSize={14} color="#94A3B8">
              {song?.title || "Selecciona una canción para reproducir"}
            </Text>
          </YStack>

          <YStack height={220} alignItems="center" justifyContent="center">
            <LottieView
              source={require("../../../../assets/animations/music.json")}
              autoPlay={isPlaying}
              loop
              style={{ width: 180, height: 180 }}
            />
          </YStack>

          <ScrollView flex={1} contentContainerStyle={{ paddingVertical: 8 }}>
            <Text color="#CBD5E1">
              {song?.lyrics ?? "No hay letras disponibles."}
            </Text>
          </ScrollView>

          <XStack justifyContent="space-between" gap="$2">
            <Button
              onPress={handleTogglePlayback}
              disabled={isLoading}
              size="$4"
            >
              {isLoading ? "Cargando..." : isPlaying ? "Pausar" : "Reproducir"}
            </Button>
            <Button onPress={() => onOpenChange(false)} theme="gray" size="$4">
              Cerrar
            </Button>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
