export type NoteRecord = {
  id: string;
  category: string;
  title: string;
  description: string | null;
  metadata: string | null;
  created_at: string | null;
};

export type ProgramRecord = {
  id: string;
  title: string;
  status: string;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
};

export type ActivityRecord = {
  id: string;
  title: string;
  activity_date: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
};

export type GalleryRecord = {
  id: string;
  title: string | null;
  image_url: string | null;
  created_at: string | null;
};

export type MemberRecord = {
  id: string;
  name: string;
  role: string | null;
  division: string | null;
  study_program: string | null;
  image_url: string | null;
  created_at: string | null;
};
