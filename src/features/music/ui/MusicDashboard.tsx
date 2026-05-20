import { useMusic } from "@/features/music/model/useMusic";
import { FontAwesome } from "@expo/vector-icons";
import {
  Button,
  Card,
  ScrollView,
  Spinner,
  Text,
  XStack,
  YStack
} from "tamagui";
import { MusicDeleteDialog } from "./MusicDeleteDialog";
import { MusicList } from "./MusicList";
import { MusicPlayerSheet } from "./MusicPlayerSheet";
import { MusicUploadSheet } from "./MusicUploadSheet";

export const MusicDashboard = () => {
  const {
    songs,
    isSongsLoading,
    isFormOpen,
    isEditing,
    editingSong,
    selectedFile,
    title,
    lyrics,
    uploading,
    showSuccessAnimation,
    isDeleting,
    isPlayerOpen,
    playbackUrl,
    activeSong,
    openCreateForm,
    openEditForm,
    closeForm,
    handleTitleChange,
    handleLyricsChange,
    handleFileSelected,
    handleSubmit,
    openPlayer,
    closePlayer,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
    songToDelete,
  } = useMusic();

  return (
    <YStack flex={1} backgroundColor="#0F172A">
      <ScrollView
        flex={1}
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 32,
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
      >
        <XStack justifyContent="space-between" alignItems="flex-start" gap="$3">
          <YStack flex={1} gap="$2">
            <Text
              fontSize={12}
              fontWeight="600"
              color="#818CF8"
              textTransform="uppercase"
              letterSpacing={1}
            >
              Tu colección
            </Text>
            <Text fontSize={32} fontWeight="800" color="#F8FAFC">
              Música
            </Text>
          </YStack>

          <Button
            circular
            size="$4"
            backgroundColor="#6366F1"
            pressStyle={{ scale: 0.95 }}
            onPress={openCreateForm}
            icon={<FontAwesome name="plus" size={20} color="white" />}
          />
        </XStack>

        {isSongsLoading ? (
          <Card
            padding="$4"
            borderRadius="$6"
            backgroundColor="rgba(99, 102, 241, 0.1)"
            borderWidth={1}
            borderColor="#6366F1"
          >
            <XStack alignItems="center" gap="$2">
              <Spinner size="small" />
              <Text color="#F8FAFC">Cargando canciones...</Text>
            </XStack>
          </Card>
        ) : (
          <MusicList
            songs={songs}
            onPlay={openPlayer}
            onEdit={openEditForm}
            onDelete={openDeleteDialog}
          />
        )}
      </ScrollView>

      <MusicUploadSheet
        open={isFormOpen}
        isEditing={isEditing}
        currentFilePath={editingSong?.file_path}
        title={title}
        lyrics={lyrics}
        selectedFile={selectedFile}
        uploading={uploading}
        showSuccessAnimation={showSuccessAnimation}
        onOpenChange={() => closeForm()}
        onClose={closeForm}
        onTitleChange={handleTitleChange}
        onLyricsChange={handleLyricsChange}
        onSelectFile={handleFileSelected}
        onSubmit={handleSubmit}
      />

      <MusicPlayerSheet
        open={isPlayerOpen}
        onOpenChange={closePlayer}
        song={activeSong}
        playbackUrl={playbackUrl}
      />

      <MusicDeleteDialog
        open={Boolean(songToDelete)}
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog();
        }}
        songTitle={songToDelete?.title ?? ""}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
      />
    </YStack>
  );
};
