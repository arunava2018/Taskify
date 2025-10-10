import { Users, Lock, Share2, Activity, CheckSquare } from 'lucide-react';
export const FEATURES = [
  {
    id: 1,
    title: 'Personal To-Dos',
    description:
      'Organize your personal tasks with a simple and intuitive to-do list. Create, update, and manage your daily tasks with ease.',
    icon: Lock,
  },
  {
    id: 2,
    title: 'Shared Tasks',
    description:
      'Collaborate with your team by sharing tasks. Everyone stays on the same page and can contribute to progress.',
    icon: Users,
  },
  {
    id: 3,
    title: 'One-Click Sharing',
    description:
      'Enable sharing with a toggle and instantly generate a secure share link with a unique code for controlled access.',
    icon: Share2,
  },
  {
    id: 4,
    title: 'Accept or Decline Invites',
    description:
      'When someone shares a task, you can accept or decline it. Accepted tasks automatically appear in your shared section.',
    icon: Activity,
  },
  {
    id: 5,
    title: 'Smart Task Completion',
    description:
      'Track your progress effortlessly with clean visuals. Mark tasks as done and feel the satisfaction of getting things done.',
    icon: CheckSquare,
  },
];
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Product Manager @ TechFlow',
    company: 'TechFlow',
    feedback:
      "Taskify completely transformed how our remote team collaborates. The seamless sharing feature eliminated our project bottlenecks, and we saw a 40% increase in productivity within the first month. It's intuitive enough that everyone adopted it immediately.",
    avatar: 'https://i.pravatar.cc/100?img=1',
    rating: 5,
    location: 'San Francisco, CA',
    featured: true,
    metrics: '40% productivity increase',
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Senior Developer',
    company: 'DevCorp Solutions',
    feedback:
      "As someone who juggles multiple projects daily, Taskify's toggle between personal and team tasks is a game-changer. No more switching between different tools - everything lives in one clean, fast interface that actually works.",
    avatar: 'https://i.pravatar.cc/100?img=2',
    rating: 5,
    location: 'Austin, TX',
    featured: false,
    metrics: null,
  },
  {
    id: 3,
    name: 'Dr. Emily Watson',
    role: 'Research Director',
    company: 'MedInnovate Labs',
    feedback:
      "Managing research projects with multiple stakeholders used to be chaotic. Taskify's collaborative features help us track deliverables across teams effortlessly. The clean design means less time learning the tool and more time on actual research.",
    avatar: 'https://i.pravatar.cc/100?img=3',
    rating: 5,
    location: 'Boston, MA',
    featured: true,
    metrics: '50+ team members',
  },
  {
    id: 4,
    name: 'James Park',
    role: 'Startup Founder',
    company: 'NexGen Analytics',
    feedback:
      "We tried 7 different task management tools before finding Taskify. Finally, something that doesn't overwhelm with features we don't need. The sharing functionality is so smooth that our entire team was up and running in under 10 minutes.",
    avatar: 'https://i.pravatar.cc/100?img=4',
    rating: 5,
    location: 'Seattle, WA',
    featured: false,
    metrics: '10min setup time',
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'Creative Director',
    company: 'Pixel Studio',
    feedback:
      'Our design team needed something visual and collaborative without the complexity. Taskify strikes the perfect balance - powerful enough for our workflow but simple enough that freelancers can jump in immediately. Love the clean interface!',
    avatar: 'https://i.pravatar.cc/100?img=5',
    rating: 5,
    location: 'New York, NY',
    featured: true,
    metrics: '15+ freelancers onboarded',
  },
  {
    id: 6,
    name: 'Alex Kumar',
    role: 'Operations Manager',
    company: 'GrowthLab Inc',
    feedback:
      'The simplicity is deceptive - behind that clean interface is everything we need for cross-departmental projects. Task sharing feels natural, and the performance is lightning fast even with our 200+ person team using it daily.',
    avatar: 'https://i.pravatar.cc/100?img=6',
    rating: 5,
    location: 'Chicago, IL',
    featured: false,
    metrics: '200+ daily users',
  },
];
export const FAQS = [
  {
    id: 1,
    question: 'Is Taskify free to use?',
    answer:
      'Yes! Taskify is completely free for personal use. Create unlimited personal tasks, organize them with categories, and share them with your team without any restrictions. We believe productivity tools should be accessible to everyone.',
  },
  {
    id: 2,
    question: 'How does task sharing work?',
    answer:
      'Sharing tasks is simple - just toggle the sharing option on any task to generate a secure, unique link. Share this link with your team members via email, chat, or any platform you prefer. Recipients can then accept or decline the collaboration invite directly from their dashboard.',
  },
  {
    id: 3,
    question: 'Can I revoke access to a shared task?',
    answer:
      "Absolutely! You have full control over your shared tasks. Simply turn off the sharing toggle in your task settings, and the link becomes invalid immediately. The task will disappear from collaborators' shared sections and they'll no longer receive notifications about it.",
  },
  {
    id: 4,
    question: 'Do collaborators need a Taskify account?',
    answer:
      'Yes, collaborators need to create a free Taskify account to participate in shared tasks. This ensures they have a dedicated dashboard to manage all their personal and shared tasks in one place, plus receive proper notifications and updates.',
  },
  {
    id: 5,
    question: 'How secure is my data?',
    answer:
      'Your privacy and security are our top priorities. We use industry-standard encryption for all data transmission, secure authentication protocols, and follow best practices for data protection. Your tasks are stored securely and never shared with third parties.',
  },
  {
    id: 6,
    question: 'Can I organize tasks into categories or projects?',
    answer:
      'Yes! Taskify supports flexible organization through custom categories and tags. You can create project-specific groups, set priorities, add due dates, and filter tasks by various criteria to keep your workflow organized and efficient.',
  },
  {
    id: 7,
    question: 'Does Taskify work offline?',
    answer:
      "Taskify works best with an internet connection for real-time syncing and collaboration features. However, you can view and edit your tasks offline, and changes will sync automatically when you're back online.",
  },
  {
    id: 8,
    question: 'How do I get notified about task updates?',
    answer:
      'Taskify sends notifications for important events like task assignments, due date reminders, and collaboration requests. You can customize your notification preferences in your account settings to receive alerts via email or in-app notifications.',
  },
  {
    id: 9,
    question: 'Is there a limit to how many tasks I can create?',
    answer:
      'No limits! Create as many personal tasks as you need. For shared tasks and team collaboration, you can invite unlimited team members and share as many tasks as necessary - all completely free.',
  },
  {
    id: 10,
    question: 'Can I export my tasks or data?',
    answer:
      'Yes, you can export your task data anytime. Taskify supports various export formats including CSV and JSON, making it easy to backup your data or migrate to other tools if needed. Your data belongs to you.',
  },
];
// constants.ts

// Priority colors
export const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium:
    'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
};

// Status colors
export const STATUS_COLORS: Record<string, string> = {
  completed:
    'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  'in-progress': 'bg-primary/10 text-primary border-primary/20',
  pending:
    'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
};

// Progress bar color helper
export const getProgressColor = (percent: number): string => {
  if (percent >= 80) return 'bg-green-500';
  if (percent >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Date formatter
export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
