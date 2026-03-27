"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, Reply, MoreHorizontal } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  role: "Teacher" | "Student";
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    author: "Pak Widodo",
    role: "Teacher",
    avatar: "W",
    content: "Anak-anak, perhatikan pada menit 3:20, itu adalah konsep kunci dalam memahami subnetting CIDR. Jika ada yang bingung, silakan tanyakan di sini.",
    timestamp: "2 hours ago",
    likes: 5,
    replies: [
      {
        id: "c1_1",
        author: "Budi Santoso",
        role: "Student",
        avatar: "B",
        content: "Pak, saya masih bingung cara menentukan block subnet. Apakah selalu dikurangi 256?",
        timestamp: "1 hour ago",
        likes: 1,
      }
    ]
  },
  {
    id: "c2",
    author: "Siti Nurhaliza",
    role: "Student",
    avatar: "S",
    content: "Video yang sangat bermanfaat! Saya jadi paham mengapa kita butuh IP Private.",
    timestamp: "5 hours ago",
    likes: 12,
  }
];

export function CommentThread() {
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");

  const handlePost = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Math.random().toString(),
      author: "You",
      role: "Student",
      avatar: "Y",
      content: newComment,
      timestamp: "Just now",
      likes: 0,
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`flex gap-4 ${isReply ? 'ml-12 mt-4 relative before:absolute before:border-l-2 before:border-b-2 before:border-muted before:-left-8 before:top-0 before:w-6 before:h-6 before:rounded-bl-xl' : 'mt-6'}`}>
      <Avatar className={`w-10 h-10 ${comment.role === 'Teacher' ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
        <AvatarFallback className={comment.role === 'Teacher' ? 'bg-primary text-primary-foreground font-bold' : ''}>{comment.avatar}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-sm relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">{comment.author}</span>
              {comment.role === "Teacher" && (
                <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">Guru</span>
              )}
              <span className="text-xs text-muted-foreground ml-1">{comment.timestamp}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground"><MoreHorizontal className="w-4 h-4" /></Button>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground px-2">
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <ThumbsUp className="w-3.5 h-3.5" /> {comment.likes > 0 && comment.likes} Suka
          </button>
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Reply className="w-3.5 h-3.5" /> Balas
          </button>
        </div>

        {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-2xl border p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Diskusi Materi</h3>
          <p className="text-sm text-muted-foreground">Ada pertanyaan? Diskusikan dengan guru dan teman kelasmu.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <Avatar className="w-10 h-10 shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">Y</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <textarea 
            placeholder="Tulis pertanyaan atau tanggapan..."
            className="w-full min-h-[80px] text-sm p-4 rounded-xl border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none bg-background leading-relaxed"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handlePost} disabled={!newComment.trim()}>
              <MessageSquare className="w-4 h-4 mr-2" /> Posting Komentar
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {comments.map(c => renderComment(c))}
      </div>
    </div>
  );
}
