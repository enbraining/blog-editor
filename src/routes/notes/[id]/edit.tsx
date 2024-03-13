import { RouteDefinition, RouteSectionProps, createAsync } from "@solidjs/router";
import { Show } from "solid-js";
import NoteEditor from "~/components/NoteEditor";
import { fetchNoteById } from "~/lib/supabase";

export const route = {
  load({ params }) {
    fetchNoteById(params.id);
  }
} satisfies RouteDefinition;

export default function EditNote({ params }: RouteSectionProps) {
  const note = createAsync(() => fetchNoteById(params.id));
  return (
    <Show when={note()}>
      <NoteEditor noteId={params.id} initialTitle={note()!.title} initialBody={note()!.description} />
    </Show>
  );
}
