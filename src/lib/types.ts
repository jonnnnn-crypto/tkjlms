// Database types matching Supabase schema

export type Role = 'admin' | 'teacher' | 'student'

export interface Profile {
  id: string
  name: string | null
  role: Role
  avatar_url: string | null
  created_at: string
}

export interface Class {
  id: string
  name: string
  description: string | null
  teacher_id: string | null
  class_code: string
  subject: string | null
  semester: string | null
  is_active: boolean
  created_at: string
  // joined
  teacher?: Pick<Profile, 'id' | 'name'>
  enrollment_count?: number
}

export interface Enrollment {
  id: string
  user_id: string
  class_id: string
  enrolled_at: string
  // joined
  class?: Class
}

export interface Material {
  id: string
  class_id: string
  title: string
  content: string | null
  type: 'text' | 'video' | 'pdf' | 'link' | 'slide'
  order_num: number
  is_published: boolean
  created_at: string
}

export interface Quiz {
  id: string
  class_id: string
  title: string
  description: string | null
  duration: number
  pass_score: number
  is_active: boolean
  created_at: string
  // joined
  question_count?: number
  submission?: Submission | null
}

export interface Question {
  id: string
  quiz_id: string
  question: string
  options: string[]        // ["A. ...", "B. ...", "C. ...", "D. ..."]
  correct_answer: string   // "A" | "B" | "C" | "D"
  explanation: string | null
  points: number
  order_num: number
}

export interface Submission {
  id: string
  user_id: string
  quiz_id: string
  answers: Record<string, string> | null
  score: number | null
  created_at: string
}

export interface Lab {
  id: string
  class_id: string
  title: string
  description: string | null
  type: 'network' | 'subnetting' | 'routing' | 'vlan' | 'security'
  difficulty: 'easy' | 'medium' | 'hard'
  config: LabConfig | null
  answer: LabAnswer | null
  is_active: boolean
  created_at: string
}

export interface LabConfig {
  type: 'network' | 'subnetting' | 'routing' | 'vlan' | 'security'
  topology?: string
  devices?: { name: string; role?: string; ip?: string }[]
  instructions?: string
}

export interface LabAnswer {
  ip: string
  gateway: string
  subnet: string
  dns?: string
}

export interface LabSubmission {
  id: string
  user_id: string
  lab_id: string
  answers: Partial<LabAnswer> | null
  is_correct: boolean
  created_at: string
}

// Form action state — must be undefined-compatible for useActionState
export type ActionState = { error?: string; success?: string } | undefined
