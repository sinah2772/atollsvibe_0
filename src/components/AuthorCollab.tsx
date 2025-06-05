import React from "react";
import { CollaborativeUser } from "../hooks/useCollaborativeArticle";

interface Author {
  name: string;
  avatar: string;
  role: string;
  email?: string;
  isActive?: boolean;
  currentField?: string;
}

interface AuthorCollabProps {
  authors?: Author[];
  activeUsers?: CollaborativeUser[];
  collaboratorEmails?: string[];
}

// Helper function to generate consistent color based on email
const getAvatarColor = (email: string) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-teal-500",
  ];
  
  const hash = email.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

// Helper function to get initials from email or name
const getInitials = (email: string) => {
  return email
    .split("@")[0]
    .split(".")
    .map(part => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

// Default collaborators for demo and fallback
const defaultAuthors = [
  {
    name: "Mohamed Sinah",
    avatar: "https://i.pravatar.cc/150?img=32",
    role: "Writer",
  },
  {
    name: "Aishath Leena",
    avatar: "https://i.pravatar.cc/150?img=45",
    role: "Editor",
  },
];

export default function AuthorCollab({ 
  authors,
  activeUsers = [],
  collaboratorEmails = []
}: AuthorCollabProps) {
  // Combine active users and collaborator emails into a unified author list
  const combinedAuthors: Author[] = React.useMemo(() => {
    const result: Author[] = [];
    
    // Add active users first
    activeUsers.forEach(user => {
      // Create author object from active user
      const author: Author = {
        name: user.user_email.split("@")[0],
        email: user.user_email,
        avatar: "", // Will use initials instead
        role: user.current_field ? `Editing ${user.current_field}` : "Active now",
        isActive: true,
        currentField: user.current_field
      };
      result.push(author);
    });
    
    // Add collaborator emails that aren't already active
    collaboratorEmails.forEach(email => {
      if (!result.some(a => a.email === email)) {
        result.push({
          name: email.split("@")[0],
          email: email,
          avatar: "",
          role: "Collaborator"
        });
      }
    });
    
    // If provided with specific author objects, add those that aren't covered yet
    if (authors) {
      authors.forEach(author => {
        if (!author.email || !result.some(a => a.email === author.email)) {
          result.push(author);
        }
      });
    }
    
    // If still empty, use defaults
    if (result.length === 0 && !authors) {
      return defaultAuthors;
    }
    
    return result;
  }, [activeUsers, collaboratorEmails, authors]);

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl border border-gray-200 shadow-md bg-white">
      {combinedAuthors.map((author, index) => (
        <div
          key={index}
          className="flex items-center gap-3 transition-all duration-300 hover:bg-gray-50 px-2 py-1 rounded-xl"
        >
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover border"
            />
          ) : (
            <div 
              className={`${getAvatarColor(author.email || author.name)} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold relative`}
            >
              {getInitials(author.email || author.name)}
              {author.isActive && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              )}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-gray-800">
              {author.name}
            </span>
            <span className="text-xs text-gray-500">
              {author.role}
              {author.currentField && (
                <span className="ml-1 text-blue-500">({author.currentField})</span>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
