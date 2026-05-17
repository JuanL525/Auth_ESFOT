import { useMusic } from "@/features/music/model/useMusic";
import {
    Button,
    Card,
    ScrollView,
    Spinner,
    Text,
    XStack,
    YStack,
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
    <YStack flex={1} padding="$4">
      <ScrollView
        flex={1}
        contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap="$3"
        >
          <YStack flex={1} gap="$2">
            <Text fontSize={22} fontWeight="800">
              Reproductor de música
            </Text>
            <Text color="#94A3B8" fontSize={13}>
              Administra tu biblioteca, sube nuevos temas y controla tu
              colección.
            </Text>
          </YStack>

          <Button onPress={openCreateForm} size="$3">
            Subir música
          </Button>
        </XStack>

        {isSongsLoading ? (
          <Card padding="$4" borderRadius="$6" theme="blue">
            <XStack alignItems="center" gap="$2">
              <Spinner size="small" />
              <Text>Cargando canciones...</Text>
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
