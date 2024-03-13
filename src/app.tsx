import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import EditButton from "~/components/EditButton";
import NoteList from "~/components/NoteList";
import "./app.css";
import SearchField from "./components/SearchField";
import { fetchNoteList } from "./lib/supabase";

export default function App() {
  return (
    <Router
      root={props => (
        <div class="main" $ServerOnly>
          <section class="col sidebar">
            <section class="sidebar-menu" role="menubar">
              <SearchField />
              <EditButton>New</EditButton>
            </section>
            <nav>
              <Suspense fallback="Loading Notes..">
                <NoteList searchText={props.location.query.searchText || ""} />
              </Suspense>
            </nav>
          </section>
          <section class="col note-viewer">
            <Suspense fallback="Loading Content">{props.children}</Suspense>
          </section>
        </div>
      )}
      rootLoad={({ location }) => fetchNoteList()}
    >
      <FileRoutes />
    </Router>
  );
}
