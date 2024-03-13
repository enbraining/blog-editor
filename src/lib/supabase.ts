import { action, cache, redirect } from "@solidjs/router";
import { format } from "date-fns";
import { marked } from "marked";
import type { Note } from "./types";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL ?? '', import.meta.env.VITE_SUPABASE_ANON_KEY ?? '')

export const fetchNoteList = cache(async () => {
  "use server";
  let { data: post, error } = await supabase
    .from('post')
    .select('*')
    .order('date', { ascending: false })
  return post
}, "notes");

export const fetchNoteById = cache(async (id: string) => {
  "use server";
  let { data: post, error } = await supabase
    .from('post')
    .select('*')
    .eq('id', id)
    .order('date', { ascending: false })
  const postNote: Note = post?.at(0)
  return postNote
}, "note");

export const fetchNotePreview = cache(async (id: string) => {
  "use server";
  let { data: post, error } = await supabase
    .from('post')
    .select('*')
    .eq('id', id)
    .order('date', { ascending: false })
  if (!post) return;
  const postNote: Note = post[0]
  postNote.description = marked(postNote.description);
  postNote.date = format(new Date(postNote.date), "d MMM yyyy 'at' h:mm bb");
  return postNote;
}, "note-preview");

export const saveNote = action(async (id: string | undefined, formData: FormData) => {
  "use server";
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  let { data, error } = await supabase
  .from('post')
  .update({ title: title, description: body })
  .eq('id', id)
  .select()

  if(data == null){
    await supabase
      .from('post')
      .insert({ title: title, description: body })
      .eq('id', id)
      .select()
  }

  return redirect(`/notes/${id}`);
});

export const deleteNote = action(async (id: string) => {
  "use server";

  const { error } = await supabase
  .from('post')
  .delete()
  .eq('id', id)
});
