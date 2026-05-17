import { supabase } from "@/shared/api/supabase";
import { decode } from "base64-arraybuffer";
// ✅ PON ESTA EN SU LUGAR:
import * as FileSystem from "expo-file-system/legacy";
import { Song } from "./types";

export const MUSIC_BUCKET = "musica_usuario";

const normalizeFileName = (name: string): string => {
  const extension = name.split(".").pop() ?? "mp3";
  // Quitamos la extensión del nombre original para no duplicarla
  const nameWithoutExt = name.replace(`.${extension}`, "");
  const sanitized = nameWithoutExt
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
  return `${Date.now()}-${sanitized}.${extension}`;
};

export const fetchSongsForUser = async (userId: string): Promise<Song[]> => {
  const { data, error } = await supabase
    .from("songs")
    .select("id,title,lyrics,file_path,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

export const uploadSongFile = async (
  file: { name: string; uri: string },
  userId: string,
): Promise<string> => {
  const fileName = `${userId}/${normalizeFileName(file.name)}`;
  
  // SOLUCIÓN DEFINITIVA PARA REACT NATIVE:
  // 1. Leemos el archivo físico y lo convertimos a texto Base64
  const base64 = await FileSystem.readAsStringAsync(file.uri, {
    encoding: 'base64', // <-- Cambiamos esto a un simple string
  });

  // 2. Usamos 'decode' para transformar ese texto en un formato que Supabase acepte
  const { data, error } = await supabase.storage
    .from(MUSIC_BUCKET)
    .upload(fileName, decode(base64), { 
      upsert: false,
      contentType: 'audio/mpeg' // Opcional, pero ayuda a Supabase a identificarlo
    });

  if (error) throw error;
  if (!data?.path) throw new Error("No se obtuvo la ruta de almacenamiento");

  return data.path;
};

export const createSong = async (payload: {
  title: string;
  lyrics: string;
  file_path: string;
  user_id: string;
}): Promise<Song> => {
  const { data, error } = await supabase
    .from("songs")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSong = async (payload: {
  id: string;
  title: string;
  lyrics: string;
  file_path?: string;
}): Promise<Song> => {
  const { data, error } = await supabase
    .from("songs")
    .update({
      title: payload.title,
      lyrics: payload.lyrics,
      file_path: payload.file_path,
    })
    .eq("id", payload.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSongRow = async (songId: string): Promise<void> => {
  const { error } = await supabase.from("songs").delete().eq("id", songId);
  if (error) throw error;
};

export const deleteSongFile = async (filePath: string): Promise<void> => {
  const { error } = await supabase.storage
    .from(MUSIC_BUCKET)
    .remove([filePath]);
  if (error) throw error;
};

export const getSongPlaybackUrl = async (filePath: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(MUSIC_BUCKET)
    .createSignedUrl(filePath, 60);

  if (error) throw error;
  if (!data?.signedUrl)
    throw new Error("No se pudo generar la URL de reproducción");

  return data.signedUrl;
};