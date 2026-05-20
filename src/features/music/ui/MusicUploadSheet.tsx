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
        <Text fontSize={18} fontWeight="700" color="#F8FAFC">
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
        backgroundColor="#0F172A"
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
              <Text fontSize={18} fontWeight="700" color="#F8FAFC">
                {isEditing ? "Editar canción" : "Subir nueva canción"}
              </Text>

              <Text
                fontSize={12}
                color="#818CF8"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing={1}
              >
                Título
              </Text>
              <Input
                value={title}
                onChangeText={onTitleChange}
                placeholder="Escribe el título aquí"
                size="$4"
                backgroundColor="rgba(255,255,255,0.05)"
                color="#F8FAFC"
                placeholderTextColor={"#64748B" as any}
                borderWidth={1}
                borderColor="rgba(255,255,255,0.1)"
                borderRadius="$3"
                padding="$3"
                focusStyle={{
                  borderColor: "#6366f1",
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              />

              <Text
                fontSize={12}
                color="#818CF8"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing={1}
              >
                Letras (opcional)
              </Text>
              <TextArea
                value={lyrics}
                onChangeText={onLyricsChange}
                placeholder="Añade las letras aquí (opcional)"
                minHeight={120}
                backgroundColor="rgba(255,255,255,0.05)"
                color="#F8FAFC"
                placeholderTextColor={"#64748B" as any}
                borderWidth={1}
                borderColor="rgba(255,255,255,0.1)"
                borderRadius="$3"
                padding="$3"
                focusStyle={{
                  borderColor: "#6366f1",
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
              />

              <Card
                borderRadius="$5"
                padding="$3"
                backgroundColor="rgba(15,23,42,0.5)"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.05)"
                elevation="$2"
              >
                <Text color="#F8FAFC" fontWeight="700">
                  {isEditing ? "Archivo actual:" : "Archivo seleccionado:"}
                </Text>
                <Text marginTop="$2" color="#F8FAFC">
                  {selectedFile?.name ||
                    currentFilePath ||
                    "Ningún archivo seleccionado"}
                </Text>
                <Button
                  size="$3"
                  onPress={pickAudioFile}
                  marginTop="$3"
                  backgroundColor="rgba(255,255,255,0.05)"
                  borderWidth={1}
                  borderColor="rgba(255,255,255,0.08)"
                >
                  <Text color="#F8FAFC">
                    {isEditing ? "Cambiar archivo" : "Elegir archivo"}
                  </Text>
                </Button>
              </Card>

              <Button
                onPress={onSubmit}
                disabled={uploading}
                size="$4"
                backgroundColor="#6366f1"
                pressStyle={{ scale: 0.98, backgroundColor: "#4f46e5" }}
                borderWidth={0}
              >
                <Text color="#F8FAFC" fontWeight="800">
                  {uploading
                    ? isEditing
                      ? "Actualizando…"
                      : "Subiendo…"
                    : isEditing
                      ? "Actualizar canción"
                      : "Guardar canción"}
                </Text>
              </Button>
            </>
          )}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
