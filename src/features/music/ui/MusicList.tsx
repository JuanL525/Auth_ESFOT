import { Song } from "@/features/music/model/types";
import { FontAwesome } from "@expo/vector-icons";
import { Button, Text, XStack, YStack } from "tamagui";

interface MusicListProps {
  songs: Song[];
  onPlay?: (song: Song) => void;
  onEdit?: (song: Song) => void;
  onDelete?: (song: Song) => void;
}

export const MusicList = ({
  songs,
  onPlay,
  onEdit,
  onDelete,
}: MusicListProps) => {
  if (!songs.length) {
    return (
      <YStack
        padding="$4"
        borderRadius="$4"
        backgroundColor="rgba(255, 255, 255, 0.05)"
        alignItems="center"
        justifyContent="center"
        minHeight={120}
      >
        <Text fontSize={16} fontWeight="700" marginBottom="$2" color="#F8FAFC">
          No hay canciones aún
        </Text>
        <Text color="#94A3B8" textAlign="center">
          Sube tu primera canción para verla en la lista.
        </Text>
      </YStack>
    );
  }

  return (
    <YStack gap="$3">
      {songs.map((song) => (
        <XStack
          key={song.id}
          backgroundColor="rgba(255, 255, 255, 0.05)"
          borderRadius="$4"
          padding="$3"
          alignItems="center"
          gap="$3"
          pressStyle={{
            scale: 0.98,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Carátula de música */}
          <YStack
            width={48}
            height={48}
            backgroundColor="#1E293B"
            borderRadius="$2"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <FontAwesome name="music" size={24} color="#818CF8" />
          </YStack>

          {/* Información de la canción */}
          <YStack flex={1} gap="$1">
            <Text
              fontSize={14}
              fontWeight="600"
              color="#F8FAFC"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {song.title}
            </Text>
            <Text
              fontSize={12}
              color="#94A3B8"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Canción local
            </Text>
          </YStack>

          {/* Botones de acciones */}
          <XStack gap="$2" alignItems="center" flexShrink={0}>
            <Button
              circular
              size="$2.5"
              backgroundColor="transparent"
              borderWidth={0}
              onPress={() => onPlay?.(song)}
              icon={<FontAwesome name="play" size={16} color="#94A3B8" />}
              pressStyle={{
                backgroundColor: "rgba(129, 140, 248, 0.2)",
              }}
            />
            <Button
              circular
              size="$2.5"
              backgroundColor="transparent"
              borderWidth={0}
              onPress={() => onEdit?.(song)}
              icon={<FontAwesome name="pencil" size={16} color="#94A3B8" />}
              pressStyle={{
                backgroundColor: "rgba(129, 140, 248, 0.2)",
              }}
            />
            <Button
              circular
              size="$2.5"
              backgroundColor="transparent"
              borderWidth={0}
              onPress={() => onDelete?.(song)}
              icon={<FontAwesome name="trash" size={16} color="#94A3B8" />}
              pressStyle={{
                backgroundColor: "rgba(239, 68, 68, 0.2)",
              }}
            />
          </XStack>
        </XStack>
      ))}
    </YStack>
  );
};
