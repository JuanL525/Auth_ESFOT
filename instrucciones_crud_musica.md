# Instrucciones para el Agente de IA: Implementación de CRUD de Música

## Rol del Agente
Actúa como un desarrollador Senior experto en React Native (Expo), Supabase, Tamagui y animaciones Lottie. Tu objetivo es implementar un CRUD completo para un reproductor de música basándote en los siguientes requisitos y contexto.

## Contexto del Proyecto
- **Framework:** React Native con Expo (Routing basado en app directory).
- **Backend/Auth:** Supabase. El usuario ya está autenticado.
- **UI Kit:** Tamagui (Debe usarse estrictamente para toda la interfaz: `Card`, `Sheet`, `Dialog`, `Button`, `Input`, `YStack`, `XStack`, `Text`, etc.).
- **Animaciones:** `lottie-react-native` (Ya instalado).

## Contexto de Base de Datos y Storage (Ya configurado)
No necesitas crear las tablas, asume que ya existen con la siguiente estructura y reglas RLS activas (El usuario solo puede ver/modificar sus propios registros):

**Tabla `songs`:**
- `id` (uuid, PK)
- `user_id` (uuid, FK a auth.users)
- `title` (text)
- `lyrics` (text, nullable)
- `file_path` (text) - Ruta del archivo en el storage.
- `created_at` (timestamp)

**Storage Bucket:** `musica_usuario` (Para archivos .mp4 / .mp3)

## Activos Locales Disponibles
El proyecto cuenta con 3 animaciones Lottie en la ruta `assets/animations/`:
1. `loading.json`: Para mostrar durante la subida de archivos o peticiones a Supabase.
2. `success.json`: Para mostrar brevemente cuando una canción se sube o actualiza con éxito.
3. `music.json`: Animación de ecualizador para mostrar cuando una canción está "reproduciéndose" (modo activo).

## Librerías Adicionales Requeridas
Antes de codear, verifica o instala (usando `npx expo install`):
- `expo-document-picker` (Para que el usuario seleccione el archivo MP4/MP3 de su dispositivo).
- `expo-av` (Para la reproducción real del audio/video).

---

## Tareas a Implementar (Paso a Paso)

### 1. Vista Principal (Lista de Canciones - Read)
- Crea una pantalla o componente que consulte la tabla `songs` de Supabase para el usuario actual.
- Muestra los resultados en un `ScrollView` usando el componente `Card` de Tamagui.
- Cada tarjeta debe mostrar el `title`, un botón de "Reproducir/Ver", un botón de "Editar" y un botón de "Eliminar".

### 2. Subir Nueva Canción (Create)
- Implementa un botón flotante o principal para "Subir Música".
- Al presionar, abre un `Sheet` de Tamagui con un formulario:
  - `Input` para Título (Obligatorio).
  - `Input` multilínea para Letras (Opcional).
  - Botón para seleccionar archivo (Usa `expo-document-picker`).
- **Flujo de subida:**
  1. Muestra el Lottie `loading.json`.
  2. Sube el archivo al bucket `musica_usuario` usando `supabase.storage`.
  3. Inserta el registro en la tabla `songs` con la ruta devuelta y los textos.
  4. Cambia el Lottie a `success.json` por 2 segundos.
  5. Cierra el `Sheet` y actualiza la lista.

### 3. Editar Canción (Update)
- Al presionar "Editar" en una tarjeta, abre un `Sheet` similar al de creación, pero precargado con el Título y las Letras.
- Permite actualizar estos campos en la tabla `songs`.
- Usa los Lotties de loading y success de la misma manera que en la creación.

### 4. Eliminar Canción (Delete)
- Al presionar "Eliminar", muestra un `AlertDialog` o `Dialog` de Tamagui para confirmar la acción ("¿Estás seguro de que deseas eliminar esta canción?").
- Si confirma:
  1. Elimina el archivo del bucket `musica_usuario` en Supabase Storage.
  2. Elimina la fila correspondiente en la tabla `songs`.
  3. Actualiza la lista en la UI.

### 5. Reproductor Activo
- Al presionar "Reproducir" en una canción, abre un `Sheet` de Tamagui en la parte inferior.
- Muestra el Título de la canción y las Letras en un `ScrollView` pequeño.
- Usa `expo-av` para cargar la URL pública o firmada del archivo desde Supabase Storage y reproducirla.
- En el centro de este Sheet, muestra la animación `music.json` de Lottie. La propiedad `autoPlay` del Lottie debe estar vinculada al estado de reproducción (true si está sonando, false si está pausado).

## Reglas de Estilo
- Usa los tokens de Tamagui (`$4`, `$true`, `$background`, etc.) para márgenes, paddings y colores. No uses estilos en línea crudos a menos que sea estrictamente necesario.
- La aplicación debe lucir moderna (tema oscuro recomendado por ser un reproductor de música).
- Maneja los errores de Supabase con `Toast` o alertas nativas, no dejes que la app falle silenciosamente.