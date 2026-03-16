"use client";

interface StepBasicsProps {
  name: string;
  description: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
}

export function StepBasics({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: StepBasicsProps) {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold tracking-tight mb-2">
        Name your project
      </h2>
      <p className="text-sm text-muted mb-10">
        This is the start of a new Symphony. Give it a name and optional
        description.
      </p>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="project-name"
            className="block text-[12px] font-medium text-muted mb-2 uppercase tracking-[0.06em]"
          >
            Project name
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Acme Dashboard"
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-[14px] outline-none focus:border-accent/40 transition-colors placeholder:text-muted-2"
            autoFocus
          />
        </div>

        <div>
          <label
            htmlFor="project-desc"
            className="block text-[12px] font-medium text-muted mb-2 uppercase tracking-[0.06em]"
          >
            Description
            <span className="text-muted-2 ml-1 normal-case tracking-normal">
              (optional)
            </span>
          </label>
          <textarea
            id="project-desc"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="What are you building?"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-[14px] outline-none focus:border-accent/40 transition-colors placeholder:text-muted-2 resize-none"
          />
        </div>
      </div>
    </div>
  );
}