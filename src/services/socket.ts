import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

class SocketService {
  private locationSocket: Socket | null = null;
  private chatSocket: Socket | null = null;
  private groupsSocket: Socket | null = null;
  private notificationsSocket: Socket | null = null;

  private getToken(): string | null {
    return useAuthStore.getState().token;
  }

  // Location Socket
  connectLocation(): Socket {
    if (this.locationSocket?.connected) {
      return this.locationSocket;
    }

    this.locationSocket = io(`${WS_URL}/location`, {
      auth: { token: this.getToken() },
      transports: ['websocket'],
    });

    return this.locationSocket;
  }

  disconnectLocation(): void {
    this.locationSocket?.disconnect();
    this.locationSocket = null;
  }

  getLocationSocket(): Socket | null {
    return this.locationSocket;
  }

  // Chat Socket
  connectChat(): Socket {
    if (this.chatSocket?.connected) {
      return this.chatSocket;
    }

    this.chatSocket = io(`${WS_URL}/chat`, {
      auth: { token: this.getToken() },
      transports: ['websocket'],
    });

    return this.chatSocket;
  }

  disconnectChat(): void {
    this.chatSocket?.disconnect();
    this.chatSocket = null;
  }

  getChatSocket(): Socket | null {
    return this.chatSocket;
  }

  // Groups Socket
  connectGroups(): Socket {
    if (this.groupsSocket?.connected) {
      return this.groupsSocket;
    }

    this.groupsSocket = io(`${WS_URL}/groups`, {
      auth: { token: this.getToken() },
      transports: ['websocket'],
    });

    return this.groupsSocket;
  }

  disconnectGroups(): void {
    this.groupsSocket?.disconnect();
    this.groupsSocket = null;
  }

  getGroupsSocket(): Socket | null {
    return this.groupsSocket;
  }

  // Notifications Socket
  connectNotifications(): Socket {
    if (this.notificationsSocket?.connected) {
      return this.notificationsSocket;
    }

    this.notificationsSocket = io(`${WS_URL}/notifications`, {
      auth: { token: this.getToken() },
      transports: ['websocket'],
    });

    return this.notificationsSocket;
  }

  disconnectNotifications(): void {
    this.notificationsSocket?.disconnect();
    this.notificationsSocket = null;
  }

  getNotificationsSocket(): Socket | null {
    return this.notificationsSocket;
  }

  // Disconnect all
  disconnectAll(): void {
    this.disconnectLocation();
    this.disconnectChat();
    this.disconnectGroups();
    this.disconnectNotifications();
  }
}

export const socketService = new SocketService();
