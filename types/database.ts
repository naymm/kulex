export type AccountKind = 'personal' | 'agent' | 'business';
export type KixikilaStatus = 'pending' | 'active' | 'completed';
export type KixikilaRole = 'organizer' | 'member';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string | null;
          country_code: string;
          full_name: string | null;
          kyc_status: 'pendente' | 'verificado';
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      kulex_accounts: {
        Row: {
          id: string;
          user_id: string;
          kind: AccountKind;
          name: string;
          membership_id: string;
          balance_cents: number;
          initials: string;
          color: string;
          avatar_url: string | null;
          status: 'active' | 'suspended' | 'pending_kyc';
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      movements: {
        Row: {
          id: string;
          account_id: string;
          title: string;
          amount_cents: number;
          type: 'credit' | 'debit';
          iso_date: string;
          reference: string | null;
          status: string;
          channel: string | null;
          category: string | null;
          type_label: string | null;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          account_id: string;
          kind: string;
          title: string;
          message: string;
          read: boolean;
          action_href: string | null;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      kixikilas: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          source: 'user' | 'platform';
          status: KixikilaStatus;
          balance_cents: number;
          invite_code: string;
          amount_per_member_cents: number;
          member_capacity: number;
          current_members: number;
          debit_day: number;
          duration_months: number;
          frequency: 'diaria' | 'semanal' | 'mensal';
          protection: string;
          commission_mode: 'deduct_from_pool' | 'separate_accounts';
          next_receiver_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      kixikila_memberships: {
        Row: {
          id: string;
          kixikila_id: string;
          account_id: string;
          role: KixikilaRole;
          participant_order: number | null;
          joined_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
      kixikila_participants: {
        Row: {
          id: string;
          kixikila_id: string;
          account_id: string | null;
          display_name: string;
          initials: string;
          color: string;
          participant_order: number;
          role: KixikilaRole;
          is_anonymous: boolean;
          is_slot: boolean;
          contributed: boolean;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
    };
    Functions: {
      register_kulex_user: {
        Args: {
          p_phone: string;
          p_country_code: string;
          p_account_kind: AccountKind;
          p_pin: string;
          p_full_name?: string | null;
        };
        Returns: string;
      };
      verify_user_pin: {
        Args: { p_pin: string };
        Returns: boolean;
      };
      join_platform_kixikila: {
        Args: { p_kixikila_id: string };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
