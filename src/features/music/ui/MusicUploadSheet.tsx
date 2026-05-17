import * as DocumentPicker from "expo-document-picker";
import LottieView from "lottie-react-native";
import { useCallback } from "react";
import { Button, Card, Input, Sheet, Text, TextArea, YStack } from "tamagui";

interface Props {
  open: boolean;
  isEditing: boolean;
  currentFilePath?: string;
  title: string;
  lyrics: string;
  selectedFile: { name: string; uri: string } | null;
  uploading: boolean;
  showSuccessAnimation: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onTitleChange: (value: string) => void;
  onLyricsChange: (value: string) => void;
  onSelectFile: (file: { name: string; uri: string }) => void;
  onSubmit: () => void;
}

export const MusicUploadSheet = ({
  open,
  isEditing,
  currentFilePath,
  title,
  lyrics,
  selectedFile,
  uploading,
  showSuccessAnimation,
  onOpenChange,
  onClose,
  onTitleChange,
  onLyricsChange,
  onSelectFile,
  onSubmit,
}: Props) => {
  const pickAudioFile = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["audio/*", "video/*"],
      copyToCacheDirectory: true,
    });

    if (
      !result.canceled &&
      Array.isArray(result.assets) &&
      result.assets.length > 0
    ) {
      const [asset] = result.assets;
      onSelectFile({ name: asset.name, uri: asset.uri });
    }
  }, [onSelectFile]);

  const renderAnimation = () => {
    const animationSource = showSuccessAnimation
      ? require("../../../../assets/animations/success.json")
      : require("../../../../assets/animations/loading.json");

    return (
      <YStack
        alignItems="center"
        justifyContent="center"
        gap="$3"
        minHeight={320}
      >
        <LottieView
          source={animationSource}
          autoPlay
          loop={!showSuccessAnimation}
          style={{ width: 180, height: 180 }}
        />
        <Text fontSize={18} fontWeight="700">
          {showSuccessAnimation
            ? isEditing
              ? "Actualizado con éxito"
              : "Subido con éxito"
            : isEditing
              ? "Actualizando canción..."
              : "Subiendo canción..."}
        </Text>
        {showSuccessAnimation ? (
          <Text color="#94A3B8">Cerrando en breve...</Text>
        ) : null}
      </YStack>
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen: boolean) => {
        if (!isOpen) onClose();
        onOpenChange(isOpen);
      }}
      modal
      dismissOnSnapToBottom
    >
      <Sheet.Overlay />
      <Sheet.Frame
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
        padding="$4"
      >
        <Sheet.Handle marginBottom="$4" />
        <YStack gap="$4">
          {uploading || showSuccessAnimation ? (
            renderAnimation()
          ) : (
            <>
              <Text fontSize={18} fontWeight="700">
                {isEditing ? "Editar canción" : "Subir nueva canción"}
              </Text>

              <Text fontSize={13} color="#FFFFFF" fontWeight="700">
                Título
              </Text>
              <Input
                value={title}
                onChangeText={onTitleChange}
                placeholder="Escribe el título aquí"
                size="$4"
                // make input light so text is readable against dark sheet
                backgroundColor="#FFFFFF"
                color="#000000"
                borderRadius={8}
                padding="$3"
              />

              <Text fontSize={13} color="#FFFFFF" fontWeight="700">
                Letras (opcional)
              </Text>
              <TextArea
                value={lyrics}
                onChangeText={onLyricsChange}
                placeholder="Añade las letras aquí (opcional)"
                minHeight={120}
                backgroundColor="#FFFFFF"
                color="#000000"
                borderRadius={8}
                padding="$3"
              />

              <Card
                borderRadius="$5"
                padding="$3"
                // give the card a subtle colored border and darker background to stand out
                backgroundColor="#06202a"
                borderWidth={1}
                borderColor="#0ea5fa"
                elevation="$4"
              >
                <Text color="#FFFFFF" fontWeight="700">
                  {isEditing ? "Archivo actual:" : "Archivo seleccionado:"}
                </Text>
                <Text marginTop="$2" color="#FFFFFF">
                  {selectedFile?.name ||
                    currentFilePath ||
                    "Ningún archivo seleccionado"}
                </Text>
                <Button size="$3" onPress={pickAudioFile} marginTop="$3">
                  {isEditing ? "Cambiar archivo" : "Elegir archivo"}
                </Button>
              </Card>

              <Button onPress={onSubmit} disabled={uploading} size="$4">
                {uploading
                  ? isEditing
                    ? "Actualizando…"
                    : "Subiendo…"
                  : isEditing
                    ? "Actualizar canción"
                    : "Guardar canción"}
              </Button>
            </>
          )}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
