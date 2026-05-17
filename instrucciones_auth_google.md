# Instrucciones para el Agente de IA: Implementación de Social Login con Google

## Rol del Agente
Actúa como un desarrollador Senior experto en React Native (Expo) y Supabase. Tu objetivo es implementar la autenticación social con Google en un proyecto que ya tiene un login de correo/contraseña funcional.

## Contexto del Proyecto
- **Framework:** React Native con Expo (Routing basado en app directory).
- **Backend/Auth:** Supabase.
- **UI Kit:** Tamagui.

## Requisito de Negocio (Parte 1)
El usuario debe tener la opción de ingresar con su cuenta de Google. Al tocar "Continuar con Google" en el login de la app -> se abre el navegador con la pantalla de Google -> el usuario elige su cuenta -> regresa a la app autenticado. Sin contraseñas ni emails de confirmación.

## Tareas a Implementar (Paso a Paso)

### 1. Dependencias Necesarias
Para que el flujo OAuth web funcione correctamente en React Native/Expo y pueda regresar a la app, verifica e instala si es necesario:
- `expo-auth-session`
- `expo-crypto`

### 2. Modificación de la Interfaz (Login)
- Ubica la pantalla de Login actual (revisa `app/(auth)/login.tsx` o `src/pages/login/ui/LoginPage.tsx`).
- Usa Tamagui para agregar un separador visual debajo del formulario tradicional (ejemplo: un texto que diga "O continuar con").
- Agrega un botón de Tamagui prominente que diga "Continuar con Google". Usa un icono de Google si está disponible en tu paquete de iconos, o simplemente un estilo diferenciado.

### 3. Lógica de Supabase OAuth
- Implementa la función para llamar a `supabase.auth.signInWithOAuth()`.
- **CRÍTICO PARA EXPO:** Asegúrate de implementar el flujo de OAuth correctamente para aplicaciones móviles. Usa `makeRedirectUri()` de `expo-auth-session` para generar la URL de redirección (callback) y pásala en las opciones de Supabase.
- Maneja la respuesta de la URL (deep link) cuando el navegador redirija de vuelta a la aplicación para que Supabase capture la sesión.
- Una vez detectada la sesión activa, el enrutador debe redirigir al usuario automáticamente al Home.

### 4. Manejo de Errores
- Si el usuario cancela el flujo en el navegador o hay un error de red, atrápalo y muestra un mensaje amigable usando alertas nativas o Toasts de la aplicación. No dejes que la app crashee.