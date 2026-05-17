import { Song } from "@/features/music/model/types";
import { Button, Card, Text, XStack, YStack } from "tamagui";

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
      <Card
        padding="$4"
        borderRadius="$6"
        backgroundColor="#06202a"
        borderWidth={1}
        borderColor="#0ea5fa"
        elevation="$2"
      >
        <Text fontSize={16} fontWeight="700" marginBottom="$2" color="#FFFFFF">
          No hay canciones aún
        </Text>
        <Text color="#CFE8F9">
          Sube tu primera canción para verla en la lista.
        </Text>
      </Card>
    );
  }

  return (
    <YStack gap="$3">
      {songs.map((song) => (
        <Card
          key={song.id}
          padding="$4"
          borderRadius="$6"
          elevation="$2"
          backgroundColor="#06202a"
          borderWidth={1}
          borderColor="#0ea5fa"
        >
          <YStack gap="$2">
            <Text fontSize={16} fontWeight="700" color="#FFFFFF">
              {song.title}
            </Text>
            <Text color="#CFE8F9" numberOfLines={2} ellipsizeMode="tail">
              {song.lyrics || "Sin letra disponible"}
            </Text>
            <XStack
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap="$2"
            >
              <Button
                size="$3"
                onPress={() => onPlay?.(song)}
                backgroundColor="#0ea5fa"
                borderWidth={0}
              >
                <Text color="#001219" fontWeight="700">
                  Reproducir
                </Text>
              </Button>
              <XStack gap="$2">
                <Button
                  size="$3"
                  onPress={() => onEdit?.(song)}
                  backgroundColor="#02121a"
                  borderWidth={1}
                  borderColor="#94A3B8"
                >
                  <Text color="#FFFFFF">Editar</Text>
                </Button>
                <Button size="$3" theme="red" onPress={() => onDelete?.(song)}>
                  Eliminar
                </Button>
              </XStack>
            </XStack>
          </YStack>
        </Card>
      ))}
    </YStack>
  );
};
