import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogTitle,
  Button,
  XStack,
  YStack,
} from "tamagui";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  songTitle: string;
  isDeleting: boolean;
  onConfirm: () => void;
}

export const MusicDeleteDialog = ({
  open,
  onOpenChange,
  songTitle,
  isDeleting,
  onConfirm,
}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* 1. AGREGAMOS EL PORTAL PARA QUE SE CENTRE BIEN EN LA PANTALLA */}
      <AlertDialog.Portal>
        <AlertDialogOverlay key="overlay" opacity={0.5} />
        
        {/* Ajusté el width a 90% para que sea responsivo en celulares */}
        <AlertDialogContent key="content" padding="$4" borderRadius="$6" width="90%" maxWidth={400}>
          <YStack gap="$4">
            <AlertDialogTitle>Eliminar canción</AlertDialogTitle>
            
            {/* 2. SOLUCIÓN ESLINT: Usamos llaves y template strings (backticks) */}
            <AlertDialogDescription>
              {`¿Estás seguro de que deseas eliminar "${songTitle}"? Esta acción no se puede deshacer.`}
            </AlertDialogDescription>
            
            <XStack justifyContent="flex-end" gap="$3" marginTop="$2">
              <AlertDialogCancel asChild>
                {/* 3. SOLUCIÓN BOTÓN CANCELAR: Forzamos el cierre con onPress */}
                <Button 
                  size="$4" 
                  theme="gray" 
                  onPress={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
              </AlertDialogCancel>
              
              <AlertDialogAction asChild>
                <Button
                  size="$4"
                  theme="red"
                  onPress={onConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </Button>
              </AlertDialogAction>
            </XStack>
          </YStack>
        </AlertDialogContent>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};