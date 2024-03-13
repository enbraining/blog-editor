import { createAsyncStore } from "@solidjs/router";
import { For, Show } from "solid-js";
import SidebarNote from "./SidebarNote";
import { fetchNoteList } from "~/lib/supabase";

export default function NoteList(props: { searchText: string }) {
  const notes = createAsyncStore(async () => await fetchNoteList());

  return (
      <Show
        when={notes()?.length}
        fallback={
          <div class="notes-empty">
            {props.searchText
              ? `Couldn't find any notes titled "${props.searchText}".`
              : "No notes created yet!"}
          </div>
        }
      >
        <ul class="notes-list">
          <For each={notes()}>
            {note => (
              <li>
                <SidebarNote note={note} />
              </li>
            )}
          </For>
        </ul>
      </Show>
  );
}
