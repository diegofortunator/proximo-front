import { create } from 'zustand';

export interface GroupMessage {
  id: string;
  content?: string;
  imageUrl?: string;
  createdAt: string;
  isMine: boolean;
  sender: {
    id: string | null;
    name?: string;
    photoUrl?: string | null;
  };
}

export interface GroupMember {
  userId: string;
  name?: string;
  photoUrl?: string;
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  members: GroupMember[];
  distance?: number;
}

interface GroupState {
  nearbyGroups: Group[];
  currentGroup: Group | null;
  currentMessages: GroupMessage[];
  typingUsers: Map<string, boolean>;
  setNearbyGroups: (groups: Group[]) => void;
  setCurrentGroup: (group: Group | null) => void;
  setMessages: (messages: GroupMessage[]) => void;
  addMessage: (message: GroupMessage) => void;
  setTyping: (userId: string, isTyping: boolean) => void;
  addMember: (member: GroupMember) => void;
  removeMember: (userId: string) => void;
}

export const useGroupStore = create<GroupState>((set) => ({
  nearbyGroups: [],
  currentGroup: null,
  currentMessages: [],
  typingUsers: new Map(),

  setNearbyGroups: (groups: Group[]) => {
    set({ nearbyGroups: groups });
  },

  setCurrentGroup: (group: Group | null) => {
    set({ currentGroup: group });
  },

  setMessages: (messages: GroupMessage[]) => {
    set({ currentMessages: messages });
  },

  addMessage: (message: GroupMessage) => {
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

  addMember: (member: GroupMember) => {
    set((state) => {
      if (!state.currentGroup) return state;
      return {
        currentGroup: {
          ...state.currentGroup,
          members: [...state.currentGroup.members, member],
          memberCount: state.currentGroup.memberCount + 1,
        },
      };
    });
  },

  removeMember: (userId: string) => {
    set((state) => {
      if (!state.currentGroup) return state;
      return {
        currentGroup: {
          ...state.currentGroup,
          members: state.currentGroup.members.filter((m) => m.userId !== userId),
          memberCount: state.currentGroup.memberCount - 1,
        },
      };
    });
  },
}));
