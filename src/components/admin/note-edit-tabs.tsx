'use client';

import { NoteCoreForm } from '@/components/admin/note-core-form';
import { NoteTranslationForm } from '@/components/admin/note-translation-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AdminPostDetail } from '@/lib/db/admin-posts';

export function NoteEditTabs({ note }: { note: AdminPostDetail }) {
  return (
    <Tabs defaultValue="core">
      <TabsList>
        <TabsTrigger value="core">Core</TabsTrigger>
        <TabsTrigger value="en">English</TabsTrigger>
        <TabsTrigger value="de">German</TabsTrigger>
      </TabsList>
      <TabsContent value="core" className="mt-4">
        <NoteCoreForm note={note.core} />
      </TabsContent>
      <TabsContent value="en" className="mt-4">
        <NoteTranslationForm postId={note.core.id} locale="en" translation={note.translations.en} />
      </TabsContent>
      <TabsContent value="de" className="mt-4">
        <NoteTranslationForm postId={note.core.id} locale="de" translation={note.translations.de} />
      </TabsContent>
    </Tabs>
  );
}
