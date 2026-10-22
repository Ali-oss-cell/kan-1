import { downloadAuthed } from "@/dashboard/remote";

export function FileLink({ name, dataUrl, downloadUrl }: { name: string; dataUrl: string; downloadUrl?: string }) {
  if (!downloadUrl) {
    return (
      <a href={dataUrl} download={name} className="font-bold underline">
        {name}
      </a>
    );
  }
  return (
    <button type="button" className="font-bold underline" onClick={() => downloadAuthed(downloadUrl, name)}>
      {name}
    </button>
  );
}
