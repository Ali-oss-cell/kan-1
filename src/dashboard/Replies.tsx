import { useState, type FormEvent } from "react";
import { formatDate } from "@/dashboard/logic";
import type { Reply } from "@/dashboard/types";
import { FormError } from "@/dashboard/ui";

export function ReplyList({
  replies,
  onReply,
}: {
  replies: Reply[];
  onReply: (body: string) => void;
}) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!body.trim()) {
      setError("Write a reply first.");
      return;
    }
    onReply(body.trim());
    setBody("");
    setError(null);
  };

  return (
    <div className="mt-3 grid gap-2">
      {replies
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((reply) => (
          <p key={reply.id} className="border-3 border-ink bg-paper px-3 py-2 text-small">
            <span className="font-bold">{reply.authorName}</span>
            <span className="text-ink/60"> · {formatDate(reply.date)}</span>
            <span className="mt-1 block whitespace-pre-wrap text-body">{reply.body}</span>
          </p>
        ))}
      <form onSubmit={submit} className="grid gap-2">
        <textarea
          className="field resize-y"
          rows={2}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Reply"
        />
        <FormError message={error} />
        <button type="submit" className="btn btn-sm btn-paper w-fit">
          Reply
        </button>
      </form>
    </div>
  );
}
