export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.15';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      certification_translations: {
        Row: {
          certification_id: string;
          id: string;
          locale: Database['public']['Enums']['locale_code'];
          name: string;
        };
        Insert: {
          certification_id: string;
          id?: string;
          locale: Database['public']['Enums']['locale_code'];
          name: string;
        };
        Update: {
          certification_id?: string;
          id?: string;
          locale?: Database['public']['Enums']['locale_code'];
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'certification_translations_certification_id_fkey';
            columns: ['certification_id'];
            isOneToOne: false;
            referencedRelation: 'certifications';
            referencedColumns: ['id'];
          },
        ];
      };
      certifications: {
        Row: {
          created_at: string;
          id: string;
          issue_date: string | null;
          issuer: string | null;
          priority: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          issue_date?: string | null;
          issuer?: string | null;
          priority?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          issue_date?: string | null;
          issuer?: string | null;
          priority?: string;
        };
        Relationships: [];
      };
      chat_feedback: {
        Row: {
          comment: string | null;
          created_at: string;
          id: string;
          ip_hash: string | null;
          message_id: string | null;
          rating: string | null;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          ip_hash?: string | null;
          message_id?: string | null;
          rating?: string | null;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          id?: string;
          ip_hash?: string | null;
          message_id?: string | null;
          rating?: string | null;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          ip_hash: string | null;
          message: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          ip_hash?: string | null;
          message: string;
          name: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          ip_hash?: string | null;
          message?: string;
          name?: string;
        };
        Relationships: [];
      };
      post_translations: {
        Row: {
          body_markdown: string | null;
          created_at: string;
          id: string;
          locale: Database['public']['Enums']['locale_code'];
          post_id: string;
          published: boolean;
          review_status: Database['public']['Enums']['review_status_type'];
          title: string;
          updated_at: string;
        };
        Insert: {
          body_markdown?: string | null;
          created_at?: string;
          id?: string;
          locale: Database['public']['Enums']['locale_code'];
          post_id: string;
          published?: boolean;
          review_status?: Database['public']['Enums']['review_status_type'];
          title: string;
          updated_at?: string;
        };
        Update: {
          body_markdown?: string | null;
          created_at?: string;
          id?: string;
          locale?: Database['public']['Enums']['locale_code'];
          post_id?: string;
          published?: boolean;
          review_status?: Database['public']['Enums']['review_status_type'];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_translations_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
        ];
      };
      posts: {
        Row: {
          created_at: string;
          id: string;
          published: boolean;
          published_at: string | null;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profile_translations: {
        Row: {
          about_text: string | null;
          availability_line: string | null;
          created_at: string;
          hero_headline: string | null;
          hero_subheadline: string | null;
          id: string;
          locale: Database['public']['Enums']['locale_code'];
          profile_id: string;
          review_status: Database['public']['Enums']['review_status_type'];
          updated_at: string;
        };
        Insert: {
          about_text?: string | null;
          availability_line?: string | null;
          created_at?: string;
          hero_headline?: string | null;
          hero_subheadline?: string | null;
          id?: string;
          locale: Database['public']['Enums']['locale_code'];
          profile_id: string;
          review_status?: Database['public']['Enums']['review_status_type'];
          updated_at?: string;
        };
        Update: {
          about_text?: string | null;
          availability_line?: string | null;
          created_at?: string;
          hero_headline?: string | null;
          hero_subheadline?: string | null;
          id?: string;
          locale?: Database['public']['Enums']['locale_code'];
          profile_id?: string;
          review_status?: Database['public']['Enums']['review_status_type'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_translations_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_storage_path: string | null;
          beng_end_date: string | null;
          beng_program: string | null;
          beng_start_date: string | null;
          beng_university: string | null;
          created_at: string;
          full_name: string;
          github_url: string | null;
          id: string;
          linkedin_url: string | null;
          location: string | null;
          msc_end_date: string | null;
          msc_program: string | null;
          msc_specialization: string | null;
          msc_start_date: string | null;
          msc_university: string | null;
          primary_title: string;
          public_email: string | null;
          resume_storage_path: string | null;
          supporting_descriptor: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_storage_path?: string | null;
          beng_end_date?: string | null;
          beng_program?: string | null;
          beng_start_date?: string | null;
          beng_university?: string | null;
          created_at?: string;
          full_name: string;
          github_url?: string | null;
          id?: string;
          linkedin_url?: string | null;
          location?: string | null;
          msc_end_date?: string | null;
          msc_program?: string | null;
          msc_specialization?: string | null;
          msc_start_date?: string | null;
          msc_university?: string | null;
          primary_title: string;
          public_email?: string | null;
          resume_storage_path?: string | null;
          supporting_descriptor?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_storage_path?: string | null;
          beng_end_date?: string | null;
          beng_program?: string | null;
          beng_start_date?: string | null;
          beng_university?: string | null;
          created_at?: string;
          full_name?: string;
          github_url?: string | null;
          id?: string;
          linkedin_url?: string | null;
          location?: string | null;
          msc_end_date?: string | null;
          msc_program?: string | null;
          msc_specialization?: string | null;
          msc_start_date?: string | null;
          msc_university?: string | null;
          primary_title?: string;
          public_email?: string | null;
          resume_storage_path?: string | null;
          supporting_descriptor?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_media: {
        Row: {
          alt_text: string | null;
          created_at: string;
          display_order: number | null;
          id: string;
          media_type: string;
          project_id: string;
          storage_path: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          display_order?: number | null;
          id?: string;
          media_type: string;
          project_id: string;
          storage_path: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          display_order?: number | null;
          id?: string;
          media_type?: string;
          project_id?: string;
          storage_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_media_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      project_metrics: {
        Row: {
          created_at: string;
          display_order: number | null;
          id: string;
          metric_key: string;
          project_id: string;
          updated_at: string;
          value_text: string;
          verification_note: string | null;
          verified: boolean;
        };
        Insert: {
          created_at?: string;
          display_order?: number | null;
          id?: string;
          metric_key: string;
          project_id: string;
          updated_at?: string;
          value_text: string;
          verification_note?: string | null;
          verified?: boolean;
        };
        Update: {
          created_at?: string;
          display_order?: number | null;
          id?: string;
          metric_key?: string;
          project_id?: string;
          updated_at?: string;
          value_text?: string;
          verification_note?: string | null;
          verified?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'project_metrics_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      project_section_translations: {
        Row: {
          body_markdown: string | null;
          created_at: string;
          heading: string | null;
          id: string;
          locale: Database['public']['Enums']['locale_code'];
          review_status: Database['public']['Enums']['review_status_type'];
          section_id: string;
          updated_at: string;
        };
        Insert: {
          body_markdown?: string | null;
          created_at?: string;
          heading?: string | null;
          id?: string;
          locale: Database['public']['Enums']['locale_code'];
          review_status?: Database['public']['Enums']['review_status_type'];
          section_id: string;
          updated_at?: string;
        };
        Update: {
          body_markdown?: string | null;
          created_at?: string;
          heading?: string | null;
          id?: string;
          locale?: Database['public']['Enums']['locale_code'];
          review_status?: Database['public']['Enums']['review_status_type'];
          section_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_section_translations_section_id_fkey';
            columns: ['section_id'];
            isOneToOne: false;
            referencedRelation: 'project_sections';
            referencedColumns: ['id'];
          },
        ];
      };
      project_sections: {
        Row: {
          created_at: string;
          id: string;
          project_id: string;
          section_key: string;
          section_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          project_id: string;
          section_key: string;
          section_order: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          project_id?: string;
          section_key?: string;
          section_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_sections_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      project_technologies: {
        Row: {
          project_id: string;
          technology_id: string;
          usage_label: string;
        };
        Insert: {
          project_id: string;
          technology_id: string;
          usage_label: string;
        };
        Update: {
          project_id?: string;
          technology_id?: string;
          usage_label?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_technologies_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_technologies_technology_id_fkey';
            columns: ['technology_id'];
            isOneToOne: false;
            referencedRelation: 'technologies';
            referencedColumns: ['id'];
          },
        ];
      };
      project_translations: {
        Row: {
          created_at: string;
          id: string;
          locale: Database['public']['Enums']['locale_code'];
          one_liner: string | null;
          project_id: string;
          published: boolean;
          recruiter_summary: string | null;
          review_status: Database['public']['Enums']['review_status_type'];
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          locale: Database['public']['Enums']['locale_code'];
          one_liner?: string | null;
          project_id: string;
          published?: boolean;
          recruiter_summary?: string | null;
          review_status?: Database['public']['Enums']['review_status_type'];
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          locale?: Database['public']['Enums']['locale_code'];
          one_liner?: string | null;
          project_id?: string;
          published?: boolean;
          recruiter_summary?: string | null;
          review_status?: Database['public']['Enums']['review_status_type'];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_translations_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: {
          created_at: string;
          demo_url: string | null;
          github_url: string | null;
          homepage_priority: number | null;
          id: string;
          is_repo_public: boolean;
          last_updated_at: string | null;
          project_type: string | null;
          published: boolean;
          role: string | null;
          safety_label: string | null;
          slug: string;
          start_date: string | null;
          status: string;
          team_size: number | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          demo_url?: string | null;
          github_url?: string | null;
          homepage_priority?: number | null;
          id?: string;
          is_repo_public?: boolean;
          last_updated_at?: string | null;
          project_type?: string | null;
          published?: boolean;
          role?: string | null;
          safety_label?: string | null;
          slug: string;
          start_date?: string | null;
          status: string;
          team_size?: number | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          demo_url?: string | null;
          github_url?: string | null;
          homepage_priority?: number | null;
          id?: string;
          is_repo_public?: boolean;
          last_updated_at?: string | null;
          project_type?: string | null;
          published?: boolean;
          role?: string | null;
          safety_label?: string | null;
          slug?: string;
          start_date?: string | null;
          status?: string;
          team_size?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      rate_limit_events: {
        Row: {
          created_at: string;
          endpoint: string;
          id: string;
          ip_hash: string;
        };
        Insert: {
          created_at?: string;
          endpoint: string;
          id?: string;
          ip_hash: string;
        };
        Update: {
          created_at?: string;
          endpoint?: string;
          id?: string;
          ip_hash?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          created_at: string;
          f1_explorer_enabled: boolean;
          id: string;
          swiggy_simulator_enabled: boolean;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          f1_explorer_enabled?: boolean;
          id?: string;
          swiggy_simulator_enabled?: boolean;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          f1_explorer_enabled?: boolean;
          id?: string;
          swiggy_simulator_enabled?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      skill_project_evidence: {
        Row: {
          project_id: string;
          skill_id: string;
          usage_label: string;
        };
        Insert: {
          project_id: string;
          skill_id: string;
          usage_label: string;
        };
        Update: {
          project_id?: string;
          skill_id?: string;
          usage_label?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'skill_project_evidence_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'skill_project_evidence_skill_id_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
      skill_translations: {
        Row: {
          id: string;
          locale: Database['public']['Enums']['locale_code'];
          name: string;
          skill_id: string;
        };
        Insert: {
          id?: string;
          locale: Database['public']['Enums']['locale_code'];
          name: string;
          skill_id: string;
        };
        Update: {
          id?: string;
          locale?: Database['public']['Enums']['locale_code'];
          name?: string;
          skill_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'skill_translations_skill_id_fkey';
            columns: ['skill_id'];
            isOneToOne: false;
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
      skills: {
        Row: {
          category: string;
          created_at: string;
          display_order: number | null;
          id: string;
          slug: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          display_order?: number | null;
          id?: string;
          slug: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          display_order?: number | null;
          id?: string;
          slug?: string;
        };
        Relationships: [];
      };
      technologies: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          slug: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: string;
          slug: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          slug?: string;
        };
        Relationships: [];
      };
      technology_translations: {
        Row: {
          id: string;
          locale: Database['public']['Enums']['locale_code'];
          name: string;
          technology_id: string;
        };
        Insert: {
          id?: string;
          locale: Database['public']['Enums']['locale_code'];
          name: string;
          technology_id: string;
        };
        Update: {
          id?: string;
          locale?: Database['public']['Enums']['locale_code'];
          name?: string;
          technology_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'technology_translations_technology_id_fkey';
            columns: ['technology_id'];
            isOneToOne: false;
            referencedRelation: 'technologies';
            referencedColumns: ['id'];
          },
        ];
      };
      timeline_items: {
        Row: {
          created_at: string;
          display_order: number | null;
          end_date: string | null;
          id: string;
          item_type: string;
          organization: string | null;
          start_date: string | null;
        };
        Insert: {
          created_at?: string;
          display_order?: number | null;
          end_date?: string | null;
          id?: string;
          item_type: string;
          organization?: string | null;
          start_date?: string | null;
        };
        Update: {
          created_at?: string;
          display_order?: number | null;
          end_date?: string | null;
          id?: string;
          item_type?: string;
          organization?: string | null;
          start_date?: string | null;
        };
        Relationships: [];
      };
      timeline_translations: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          locale: Database['public']['Enums']['locale_code'];
          review_status: Database['public']['Enums']['review_status_type'];
          timeline_item_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          locale: Database['public']['Enums']['locale_code'];
          review_status?: Database['public']['Enums']['review_status_type'];
          timeline_item_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          locale?: Database['public']['Enums']['locale_code'];
          review_status?: Database['public']['Enums']['review_status_type'];
          timeline_item_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'timeline_translations_timeline_item_id_fkey';
            columns: ['timeline_item_id'];
            isOneToOne: false;
            referencedRelation: 'timeline_items';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      locale_code: 'en' | 'de';
      review_status_type: 'draft' | 'machine_assisted' | 'reviewed';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      locale_code: ['en', 'de'],
      review_status_type: ['draft', 'machine_assisted', 'reviewed'],
    },
  },
} as const;
