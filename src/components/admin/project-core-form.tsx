'use client';

import { useState, useTransition } from 'react';
import type { FormEvent } from 'react';
import { saveProjectCore } from '@/app/admin/(protected)/projects/[id]/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { AdminProjectCore } from '@/lib/db/admin-projects';

const STATUS_OPTIONS = [
  'idea',
  'in_progress',
  'mvp_poc',
  'completed',
  'deployed',
  'archived',
  'coming_soon',
];
const PROJECT_TYPE_OPTIONS = ['personal', 'university', 'team', 'work', 'hackathon'];

const selectClassName =
  'border-input bg-transparent h-8 w-full min-w-0 rounded-lg border px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 md:text-sm';

export function ProjectCoreForm({ project }: { project: AdminProjectCore }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const teamSize = formData.get('teamSize');
    const homepagePriority = formData.get('homepagePriority');

    const values: Omit<AdminProjectCore, 'id' | 'slug'> = {
      status: String(formData.get('status')),
      projectType: formData.get('projectType') ? String(formData.get('projectType')) : null,
      teamSize: teamSize ? Number(teamSize) : null,
      role: formData.get('role') ? String(formData.get('role')) : null,
      startDate: formData.get('startDate') ? String(formData.get('startDate')) : null,
      lastUpdatedAt: formData.get('lastUpdatedAt') ? String(formData.get('lastUpdatedAt')) : null,
      homepagePriority: homepagePriority ? Number(homepagePriority) : null,
      safetyLabel: formData.get('safetyLabel') ? String(formData.get('safetyLabel')) : null,
      githubUrl: formData.get('githubUrl') ? String(formData.get('githubUrl')) : null,
      demoUrl: formData.get('demoUrl') ? String(formData.get('demoUrl')) : null,
      isRepoPublic: formData.get('isRepoPublic') === 'on',
      published: formData.get('published') === 'on',
    };

    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await saveProjectCore(project.id, values);
        setSaved(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={project.status}
            required
            className={selectClassName}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="projectType">Project type</Label>
          <select
            id="projectType"
            name="projectType"
            defaultValue={project.projectType ?? ''}
            className={selectClassName}
          >
            <option value="">—</option>
            {PROJECT_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="teamSize">Team size</Label>
          <Input
            id="teamSize"
            name="teamSize"
            type="number"
            min={1}
            defaultValue={project.teamSize ?? ''}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" defaultValue={project.role ?? ''} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="startDate">Start date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={project.startDate ?? ''}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastUpdatedAt">Last updated</Label>
          <Input
            id="lastUpdatedAt"
            name="lastUpdatedAt"
            type="date"
            defaultValue={project.lastUpdatedAt ?? ''}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="homepagePriority">Homepage priority</Label>
          <Input
            id="homepagePriority"
            name="homepagePriority"
            type="number"
            min={1}
            defaultValue={project.homepagePriority ?? ''}
          />
          <p className="text-muted-foreground text-xs">
            Lower = higher priority. Empty = not featured.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="safetyLabel">Safety label</Label>
          <Input id="safetyLabel" name="safetyLabel" defaultValue={project.safetyLabel ?? ''} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            name="githubUrl"
            type="url"
            defaultValue={project.githubUrl ?? ''}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="demoUrl">Demo URL</Label>
          <Input id="demoUrl" name="demoUrl" type="url" defaultValue={project.demoUrl ?? ''} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label htmlFor="isRepoPublic" className="flex items-center gap-2">
          <Switch id="isRepoPublic" name="isRepoPublic" defaultChecked={project.isRepoPublic} />
          <span className="text-sm">Repo is public</span>
        </label>
        <label htmlFor="published" className="flex items-center gap-2">
          <Switch id="published" name="published" defaultChecked={project.published} />
          <span className="text-sm">Project published</span>
        </label>
      </div>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? 'Saving…' : 'Save core fields'}
      </Button>
      {saved && !isPending ? <p className="text-muted-foreground text-sm">Saved.</p> : null}
    </form>
  );
}
