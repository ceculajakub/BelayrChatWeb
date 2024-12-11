import {Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  public connection!: signalR.HubConnection;
  private chatUrl: string = "http://localhost:5000/chat";
  public messages$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages: any[] = [];
  public users: string[] = [];

  constructor() {
    this.initializeConnection();
    this.start();
    this.on(
      'ReceiveMessage',
      (user: string, message: string, messageTime: string) => {
        this.messages = [...this.messages, {user, message, messageTime}];
        this.messages$.next(this.messages);
      }
    );
    this.on('ConnectedUser', (users: any) => {
      this.connectedUsers$.next(users);
    });
  }

  private initializeConnection(): void {
    this.connection = new HubConnectionBuilder()
      .withUrl(this.chatUrl)
      .withAutomaticReconnect()
      .build();
  }

  public async start() {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log('SignalR connection established.');
      } catch (error) {
        console.error('SignalR connection failed:', error);
        setTimeout(() => this.start(), 5000);
      }
    }
  }

  public async invoke(methodName: string, ...args: any[]): Promise<any> {
    await this.start();
    try {
      return await this.connection.invoke(methodName, ...args);
    } catch (error) {
      console.error(`SignalR invocation failed for method ${methodName}:`, error);
      throw error;
    }
  }

  public on(methodName: string, callback: (...args: any[]) => void): void {
    this.connection.on(methodName, callback);
  }

  public async stopConnection(): Promise<void> {
    if (this.connection.state === HubConnectionState.Connected) {
      await this.connection.stop();
      console.log('SignalR connection stopped.');
    }
  }

  public async joinRoom(user: string, room: string) {
    return this.invoke('JoinRoom', { user, room });
  }

  public async sendMessage(message: string) {
    return this.invoke('SendMessage', message);
  }

  public async LeaveChat() {
    return this.stopConnection();
  }

  public async reconnectToRoom(user: string, room: string): Promise<void> {
    await this.start();
    await this.invoke('JoinRoom', {user, room});
    console.log(`Reconnected to room: ${room}`);
  }
}
