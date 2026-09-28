import ReactMarkdown from 'react-markdown';

export function ProjectMarkdown({ children }: { children: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert prose-headings:font-heading max-w-none">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
