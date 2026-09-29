'use client';

import { ProjectCoreForm } from '@/components/admin/project-core-form';
import { ProjectTranslationForm } from '@/components/admin/project-translation-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AdminProjectDetail } from '@/lib/db/admin-projects';

export function ProjectEditTabs({ project }: { project: AdminProjectDetail }) {
  return (
    <Tabs defaultValue="core">
      <TabsList>
        <TabsTrigger value="core">Core</TabsTrigger>
        <TabsTrigger value="en">English</TabsTrigger>
        <TabsTrigger value="de">German</TabsTrigger>
      </TabsList>
      <TabsContent value="core" className="mt-4">
        <ProjectCoreForm project={project.core} />
      </TabsContent>
      <TabsContent value="en" className="mt-4">
        <ProjectTranslationForm
          projectId={project.core.id}
          locale="en"
          translation={project.translations.en}
        />
      </TabsContent>
      <TabsContent value="de" className="mt-4">
        <ProjectTranslationForm
          projectId={project.core.id}
          locale="de"
          translation={project.translations.de}
        />
      </TabsContent>
    </Tabs>
  );
}
