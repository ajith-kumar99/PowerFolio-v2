import { Code, Database, Globe, Cpu, Layout, Server } from 'lucide-react';

export const projectsData = [
  {
    id: 1,
    title: "AI Travel Planner",
    description: "AI Travel Planner is an intelligent chatbot-powered platform that helps users plan trips in minutes. Simply enter details like destination, dates, and preferences.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop",
    techBadge: "React, HTML/CSS +5",
    date: "29/08/2025",
    members: "1 member",
    authorName: "NIKHIL KUMAR",
    authorRole: "Project Creator",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    likes: 342,
    featured: true
  },
  {
    id: 2,
    title: "CryptoDashboard Pro",
    description: "Real-time cryptocurrency tracking dashboard with predictive analytics using historical data. Features live charts and portfolio management tools.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop",
    techBadge: "Vue.js, D3.js +3",
    date: "15/09/2025",
    members: "2 members",
    authorName: "Mike Chen",
    authorRole: "Lead Developer",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    likes: 215,
    featured: true
  },
  {
    id: 3,
    title: "EcoTrack Mobile",
    description: "Cross-platform mobile app to track personal carbon footprint and suggest eco-friendly habits. Gamified experience with daily challenges.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5c73?q=80&w=800&auto=format&fit=crop",
    techBadge: "Flutter, Firebase +4",
    date: "10/10/2025",
    members: "3 members",
    authorName: "Emma Wilson",
    authorRole: "UI/UX Designer",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    likes: 189,
    featured: true
  },
  {
    id: 4,
    title: "DevSpace Social",
    description: "A social network specifically designed for developers to share code snippets, collaborate on open source, and find mentors.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    techBadge: "MERN Stack",
    date: "05/11/2025",
    members: "4 members",
    authorName: "Alex Thompson",
    authorRole: "Full Stack Dev",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    likes: 456,
    featured: true
  },
  {
    id: 5,
    title: "Vatavarana Weather",
    description: "Vatavarana is a weather chatbot designed to be a simple, single-page application. It uses a clean, dark-themed interface built with HTML and CSS.",
    image: "https://images.unsplash.com/photo-1592210454132-7a6f27b68874?q=80&w=800&auto=format&fit=crop",
    techBadge: "HTML/CSS, JS",
    date: "28/08/2025",
    members: "1 member",
    authorName: "Sai Akhil Cholla",
    authorRole: "Project Creator",
    authorImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
    likes: 120,
    featured: false
  },
  {
    id: 6,
    title: "ThreadTalk Forums",
    description: "A community discussion platform focusing on tech threads. Features real-time updates, nested comments, and rich text editing.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
    techBadge: "React, TS +3",
    date: "28/08/2025",
    members: "1 member",
    authorName: "Atul Anand",
    authorRole: "Project Creator",
    authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    likes: 89,
    featured: false
  },
  {
    id: 7,
    title: "Age-Based Store",
    description: "A mini online shopping website built with HTML, CSS, and JavaScript. Users can filter products by age group (Kids, Teens, Adults) and see recommendations.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=800&auto=format&fit=crop",
    techBadge: "HTML/CSS, JS",
    date: "30/07/2025",
    members: "2 members",
    authorName: "Srija Mukherjee",
    authorRole: "Project Creator",
    authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    likes: 67,
    featured: false
  },
  {
    id: 8,
    title: "TaskMaster AI",
    description: "Smart task management system that uses AI to prioritize your daily workload based on deadlines and complexity scores.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop",
    techBadge: "Next.js, OpenAI",
    date: "12/12/2025",
    members: "3 members",
    authorName: "David Kim",
    authorRole: "Backend Lead",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    likes: 230,
    featured: false
  },
  {
    id: 9,
    title: "FitPulse Tracker",
    description: "A fitness application tracking workout routines, diet plans, and caloric intake with visual progress charts.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
    techBadge: "React Native",
    date: "01/01/2026",
    members: "1 member",
    authorName: "Jessica Lee",
    authorRole: "Mobile Dev",
    authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    likes: 145,
    featured: false
  },
  {
    id: 10,
    title: "EduLearn Hub",
    description: "An educational platform connecting tutors with students for real-time video lessons and whiteboard sharing.",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop",
    techBadge: "Angular, WebRTC",
    date: "14/02/2026",
    members: "5 members",
    authorName: "Ryan Park",
    authorRole: "Full Stack",
    authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    likes: 310,
    featured: true
  }
];

export const featuresData = [
  {
    icon: "Layers",
    title: "Project Repository",
    description: "A centralized, professional hub for all your academic and personal projects. No more lost zip files."
  },
  {
    icon: "Users",
    title: "Collaborate & Connect",
    description: "Find teammates for your next hackathon or get feedback from peers and industry mentors."
  },
  {
    icon: "Code",
    title: "Recruiter Ready",
    description: "Share a single, beautiful link with recruiters that showcases your code, live demos, and tech stack."
  }
];