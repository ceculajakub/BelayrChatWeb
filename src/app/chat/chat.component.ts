import { AsyncPipe, CommonModule, DatePipe, NgClass } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, inject, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgClass, DatePipe, FormsModule, AsyncPipe, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, AfterViewChecked {

  searchPhrase = '';
  chatService = inject(ChatService);
  router = inject(Router);
  messages: any[] = [];
  inputMessage = '';
  roomName = sessionStorage.getItem('room');
  filteredUsers = signal<string[]>(this.chatService.connectedUsers$.value);
  loggedInUserName = sessionStorage.getItem('user');

  @ViewChild('scrollMe') private scrollContainter!: ElementRef;

  ngOnInit(): void {
    this.chatService.messages$.subscribe((res) => (this.messages = res));
    this.chatService.connectedUsers$.subscribe((users) => {
      this.filteredUsers.set(
        this.searchPhrase
          ? users.filter((user) =>
              user.toLowerCase().includes(this.searchPhrase.toLowerCase())
            )
          : users
      );
    });
    console.log(this.messages);
  }

  ngAfterViewChecked(): void {
    this.scrollContainter.nativeElement.scrollTop = this.scrollContainter.nativeElement.scrollHeight;
  }

  sendMessage() {
    if (this.inputMessage) {
      this.chatService
        .sendMessage(this.inputMessage)
        .then(() => {
          this.inputMessage = '';
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  leaveChat() {
    this.chatService
      .LeaveChat()
      .then(() => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('room');
        this.router.navigate(['welcome']);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  searchUsers() {
    this.filteredUsers.set(
      this.chatService.connectedUsers$.value.filter((x) =>
        x.includes(this.searchPhrase)
      ) ?? this.chatService.connectedUsers$.value
    );
  }
}
