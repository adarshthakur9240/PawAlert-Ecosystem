import { supabase } from "./supabase";

export type Profile = {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string | null;
  role: 'citizen' | 'ngo' | 'vet' | 'volunteer' | 'admin';
  karma_points: number;
  rescue_streak: number;
  avatar_url: string | null;
  created_at: string;
};

export type Report = {
  id: string;
  reporter_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  location_lat: number | null;
  location_lng: number | null;
  address: string | null;
  status: 'pending' | 'dispatched' | 'on-site' | 'rescued' | 'resolved';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  animal_type: string | null;
  created_at: string;
};

export const db = {
  profiles: {
    async get(clerkId: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();
      return { data: data as Profile | null, error };
    },
    async create(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'karma_points' | 'rescue_streak'>) {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profile])
        .select()
        .single();
      return { data: data as Profile | null, error };
    }
  },
  reports: {
    async getAll() {
      const { data, error } = await supabase
        .from('reports')
        .select('*, profiles(full_name, avatar_url)')
        .order('created_at', { ascending: false });
      return { data, error };
    },
    async create(report: Omit<Report, 'id' | 'created_at' | 'updated_at' | 'status'>) {
      const { data, error } = await supabase
        .from('reports')
        .insert([report])
        .select()
        .single();
      return { data: data as Report | null, error };
    }
  }
};
