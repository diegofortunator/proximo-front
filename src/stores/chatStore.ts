import { create } from 'zustand';

export interface Message {
  id: string;
  content?: string;
  imageUrl?: string;
  createdAt: string;
  isRead: boolean;
  isMine: boolean;
  sender: {
    id: string;
    name?: string;
    photoUrl?: string;
  };
}

export interface Conversation {
  otherUser: {
    id: string;
    name?: string;
    photoUrl?: string;
    distance?: number;
    direction?: string;
  };
  lastMessage: {
    id: string;
    content?: string;
    createdAt: string;
    isMine: boolean;
    isRead: boolean;
  };
  unreadCount: number;
}

interface ChatState {
  conversations: Conversation[];
  currentMessages: Message[];
  typingUsers: Map<string, boolean>;
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setTyping: (userId: string, isTyping: boolean) => void;
  markAsRead: (messageId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentMessages: [],
  typingUsers: new Map(),

  setConversations: (conversations: Conversation[]) => {
    set({ conversations });
  },

  setMessages: (messages: Message[]) => {
    set({ currentMessages: messages });
  },

  addMessage: (message: Message) => {
    set((state) => ({
      currentMessages: [...state.currentMessages, message],
    }));
  },

  setTyping: (userId: string, isTyping: boolean) => {
    set((state) => {
      const newTypingUsers = new Map(state.typingUsers);
      if (isTyping) {
        newTypingUsers.set(userId, true);
      } else {
        newTypingUsers.delete(userId);
      }
      return { typingUsers: newTypingUsers };
    });
  },

  markAsRead: (messageId: string) => {
    set((state) => ({
      currentMessages: state.currentMessages.map((m) =>
        m.id === messageId ? { ...m, isRead: true } : m
      ),
    }));
  },
}));
