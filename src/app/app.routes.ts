import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
    {path: '', redirectTo: 'welcome', pathMatch: 'full'},
    {path: 'join-room', component: JoinRoomComponent},
    {path: 'welcome', component: WelcomeComponent},
    {path: 'chat', component: ChatComponent},
    {path: '**', redirectTo: 'welcome'},
  ]
  
