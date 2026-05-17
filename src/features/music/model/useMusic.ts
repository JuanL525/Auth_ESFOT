import { useSession } from "@/features/session/model/useSession";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import {
    createSong,
    deleteSongFile,
    deleteSongRow,
    fetchSongsForUser,
    getSongPlaybackUrl,
    updateSong,
    uploadSongFile,
} from "./musicService";
import { Song } from "./types";

export const MUSIC_QUERY_KEY = ["music", "songs"] as const;

export const useMusic = () => {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    uri: string;
  } | null>(null);
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const songsQuery = useQuery<Song[]>({
    queryKey: [...MUSIC_QUERY_KEY, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return fetchSongsForUser(user.id);
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      lyrics: string;
      file: { name: string; uri: string };
    }) => {
      if (!user?.id) throw new Error("Usuario no autenticado");
      const filePath = await uploadSongFile(payload.file, user.id);
      return createSong({
        title: payload.title,
        lyrics: payload.lyrics,
        file_path: filePath,
        user_id: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MUSIC_QUERY_KEY });
      setShowSuccessAnimation(true);
      clearSuccessAnimationTimeout();
      successTimeoutRef.current = setTimeout(() => {
        setShowSuccessAnimation(false);
        closeForm();
      }, 2000);
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.message ?? "No se pudo subir la canción.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      title: string;
      lyrics: string;
      file?: { name: string; uri: string };
      existingFilePath: string;
    }) => {
      if (!user?.id) throw new Error("Usuario no autenticado");
      const updatePayload: {
        id: string;
        title: string;
        lyrics: string;
        file_path?: string;
      } = {
        id: payload.id,
        title: payload.title,
        lyrics: payload.lyrics,
      };

      if (payload.file) {
        const filePath = await uploadSongFile(payload.file, user.id);
        await deleteSongFile(payload.existingFilePath);
        updatePayload.file_path = filePath;
      }

      return updateSong(updatePayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MUSIC_QUERY_KEY });
      setShowSuccessAnimation(true);
      clearSuccessAnimationTimeout();
      successTimeoutRef.current = setTimeout(() => {
        setShowSuccessAnimation(false);
        closeForm();
      }, 2000);
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.message ?? "No se pudo actualizar la canción.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (payload: { song: Song }) => {
      if (payload.song.file_path) {
        await deleteSongFile(payload.song.file_path);
      }
      await deleteSongRow(payload.song.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MUSIC_QUERY_KEY });
      setSongToDelete(null);
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.message ?? "No se pudo eliminar la canción.");
    },
  });

  const clearSuccessAnimationTimeout = useCallback(() => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearSuccessAnimationTimeout();
    };
  }, [clearSuccessAnimationTimeout]);

  const openCreateForm = useCallback(() => {
    clearSuccessAnimationTimeout();
    setIsEditing(false);
    setEditingSong(null);
    setSelectedFile(null);
    setTitle("");
    setLyrics("");
    setShowSuccessAnimation(false);
    setIsFormOpen(true);
  }, [clearSuccessAnimationTimeout]);

  const openEditForm = useCallback((song: Song) => {
    setIsEditing(true);
    setEditingSong(song);
    setSelectedFile(null);
    setTitle(song.title);
    setLyrics(song.lyrics ?? "");
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    clearSuccessAnimationTimeout();
    setIsFormOpen(false);
    setSelectedFile(null);
    setTitle("");
    setLyrics("");
    setIsEditing(false);
    setEditingSong(null);
    setShowSuccessAnimation(false);
  }, [clearSuccessAnimationTimeout]);

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value);
  }, []);

  const handleLyricsChange = useCallback((value: string) => {
    setLyrics(value);
  }, []);

  const handleFileSelected = useCallback(
    (file: { name: string; uri: string }) => {
      setSelectedFile(file);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    if (!title.trim()) {
      Alert.alert("Validación", "El título de la canción es obligatorio.");
      return;
    }

    if (isEditing && editingSong) {
      updateMutation.mutate({
        id: editingSong.id,
        title: title.trim(),
        lyrics: lyrics.trim(),
        existingFilePath: editingSong.file_path,
        file: selectedFile ?? undefined,
      });
      return;
    }

    if (!selectedFile) {
      Alert.alert("Validación", "Selecciona un archivo MP3 o MP4 para subir.");
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      lyrics: lyrics.trim(),
      file: selectedFile,
    });
  }, [
    title,
    lyrics,
    isEditing,
    editingSong,
    selectedFile,
    createMutation,
    updateMutation,
  ]);

  const openPlayer = useCallback(async (song: Song) => {
    setActiveSong(song);
    setIsPlayerOpen(true);
    setPlaybackUrl(null);

    try {
      const url = await getSongPlaybackUrl(song.file_path);
      setPlaybackUrl(url);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message ?? "No se pudo reproducir la canción.",
      );
      setIsPlayerOpen(false);
    }
  }, []);

  const closePlayer = useCallback(() => {
    setIsPlayerOpen(false);
    setActiveSong(null);
    setPlaybackUrl(null);
  }, []);

  const openDeleteDialog = useCallback((song: Song) => {
    setSongToDelete(song);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setSongToDelete(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!songToDelete) return;
    deleteMutation.mutate({ song: songToDelete });
  }, [songToDelete, deleteMutation]);

  return {
    songs: songsQuery.data ?? [],
    isSongsLoading: songsQuery.isLoading,
    isFormOpen,
    isEditing,
    editingSong,
    selectedFile,
    title,
    lyrics,
    uploading:
      createMutation.status === "pending" ||
      updateMutation.status === "pending",
    isDeleting: deleteMutation.status === "pending",
    isPlayerOpen,
    playbackUrl,
    activeSong,
    showSuccessAnimation,
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
  };
};
