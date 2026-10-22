import { useState, type ChangeEvent, type FormEvent } from "react";
import { formatDate, todayISO } from "@/dashboard/logic";
import { useDashboard } from "@/dashboard/store";
import type { OwnerType } from "@/dashboard/types";
import { Empty, Field, FormError } from "@/dashboard/ui";

const MAX_BYTES = 400 * 1024;

export function NotesAndFiles({ ownerType, ownerId }: { ownerType: OwnerType; ownerId: string }) {
  const { db, saveNote, deleteNote, saveFile, deleteFile } = useDashboard();
  const notes = db.notes
    .filter((note) => note.ownerType === ownerType && note.ownerId === ownerId)
    .sort((a, b) => b.date.localeCompare(a.date));
  const files = db.files
    .filter((file) => file.ownerType === ownerType && file.ownerId === ownerId)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <NoteForm
        notes={notes}
        onSave={(body, date) =>
          saveNote({
            id: crypto.randomUUID(),
            ownerType,
            ownerId,
            body,
            date,
          })
        }
        onDelete={deleteNote}
      />
      <FileForm
        files={files}
        onSave={saveFile}
        onDelete={deleteFile}
        ownerType={ownerType}
        ownerId={ownerId}
      />
    </div>
  );
}

function NoteForm({
  notes,
  onSave,
  onDelete,
}: {
  notes: { id: string; body: string; date: string }[];
  onSave: (body: string, date: string) => void;
  onDelete: (id: string) => void;
}) {
  const [body, setBody] = useState("");
  const [date, setDate] = useState(todayISO);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!body.trim()) {
      setError("Write a note before saving.");
      return;
    }
    onSave(body.trim(), date || todayISO());
    setBody("");
    setDate(todayISO());
    setError(null);
  };

  return (
    <section className="border-3 border-ink bg-paper">
      <h3 className="label-lg border-b-3 border-ink bg-lavender px-4 py-3">Notes</h3>
      <form onSubmit={submit} className="grid gap-4 p-4">
        <Field label="What happened">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={3}
            className="field resize-y"
            placeholder="Call, decision, scope change…"
          />
        </Field>
        <Field label="Date">
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="field" />
        </Field>
        <FormError message={error} />
        <button type="submit" className="btn btn-sm btn-ink w-fit">
          Add note
        </button>
      </form>
      {notes.length === 0 ? (
        <div className="px-4 pb-4">
          <Empty>No notes yet.</Empty>
        </div>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id} className="flex items-start justify-between gap-4 border-t-3 border-ink bg-paper px-4 py-3">
              <div>
                <p className="label mb-1 text-ink/60">{formatDate(note.date)}</p>
                <p className="whitespace-pre-wrap text-body">{note.body}</p>
              </div>
              <button type="button" className="label text-ink/60" onClick={() => deleteNoteSafe(onDelete, note.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FileForm({
  files,
  onSave,
  onDelete,
  ownerType,
  ownerId,
}: {
  files: { id: string; name: string; note: string; dataUrl: string; addedAt: string; shared: boolean; fromClient?: boolean }[];
  onSave: (file: {
    id: string;
    ownerType: OwnerType;
    ownerId: string;
    name: string;
    note: string;
    dataUrl: string;
    addedAt: string;
    shared: boolean;
    fromClient: boolean;
  }) => string | null;
  onDelete: (id: string) => void;
  ownerType: OwnerType;
  ownerId: string;
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError("Keep files under 400 KB in this browser copy.");
      return;
    }
    const dataUrl = await readFile(file);
    const problem = onSave({
      id: crypto.randomUUID(),
      ownerType,
      ownerId,
      name: file.name,
      note: note.trim(),
      dataUrl,
      addedAt: todayISO(),
      shared: false,
      fromClient: false,
    });
    if (problem) {
      setError(problem);
      return;
    }
    setNote("");
    setError(null);
  };

  return (
    <section className="border-3 border-ink bg-paper">
      <h3 className="label-lg border-b-3 border-ink bg-paper px-4 py-3">Files</h3>
      <div className="grid gap-4 p-4">
        <Field label="Note">
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="field"
            placeholder="Contract, brief, invoice…"
          />
        </Field>
        <Field label="File, up to 400 KB">
          <input type="file" onChange={onFile} className="field" />
        </Field>
        <FormError message={error} />
      </div>
      {files.length === 0 ? (
        <div className="px-4 pb-4">
          <Empty>No files yet.</Empty>
        </div>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file.id} className="flex items-start justify-between gap-4 border-t-3 border-ink bg-paper px-4 py-3">
              <div>
                <a href={file.dataUrl} download={file.name} className="font-bold underline">
                  {file.name}
                </a>
                <p className="label mt-1 text-ink/60">{formatDate(file.addedAt)}</p>
                {file.note ? <p className="mt-1 text-small">{file.note}</p> : null}
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  type="button"
                  className="label"
                  onClick={() => onSave({ ...file, ownerType, ownerId, fromClient: file.fromClient ?? false, shared: !file.shared })}
                >
                  {file.shared ? "Shared with client" : "Share with client"}
                </button>
                <button type="button" className="label text-ink/60" onClick={() => deleteNoteSafe(onDelete, file.id, "Delete this file?")}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function deleteNoteSafe(onDelete: (id: string) => void, id: string, message = "Delete this note?") {
  if (window.confirm(message)) onDelete(id);
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
