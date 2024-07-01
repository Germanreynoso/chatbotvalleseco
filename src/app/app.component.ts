import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatMessageService } from './services/chat-message.service';
import { IMessage } from './interfaces/messages';
import { error } from 'node:console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    CommonModule,
    ChatMessageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewChecked {
  private _chatMessageService = inject(ChatMessageService);
  title = 'chatbot-mmi-angular';
  displayChat: string = 'none';
  private _needToScroll = false;

  public messages: IMessage[] = [];

  private _fb = inject(FormBuilder);

  public askForm = this._fb.group({
    user_message: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(150)],
    ],
  });

  toogleChat() {
    const elements = document.querySelectorAll('.chatbox-popup,.chatbox-close');
    if (elements) {
      elements.forEach((element) => {
        this.displayChat = this.displayChat === 'none' ? 'block' : 'none';
        (element as HTMLElement).style.display = this.displayChat;
      });
    }
  }

  sendAskSubmit() {
    const data = this.askForm.value;
    this.askForm.reset();
    const temNumber = Math.floor(Math.random() * 1000000);
    const tempMessage: IMessage = {
      user_message: data.user_message?.toString() || '',
      bot_response: 'Escribiendo...',
      create_at: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      temp_number: temNumber,
    };
    console.log(tempMessage);
    this.pushMessage(tempMessage);
    this._needToScroll = true;
    console.log(this.messages);
    this._chatMessageService.sendMessage(data).subscribe({
      next: (response) => {
        if (response.ok) {
          console.log(response.data);
          this.messages = this.messages.map((message) => {
            if (message.temp_number === temNumber) {
              message.id = response.data.id;
              message.bot_response = response.data.bot_response;
              message.create_at = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
            }
            return message;
          });
          // this.pushMessage(response.data);
          this._needToScroll = true;
        }
      },
      error: (error) => {
        let messageResponse = '';
        if (error.status === 445) {
          messageResponse = 'Por favor intente en 5 minutos.';
        } else if (error.status === 420) {
          messageResponse = 'Not data available.';
        } else {
          messageResponse = 'Ups! Algo salió mal, por favor intente de nuevo.';
        }

        this.messages = this.messages.map((message) => {
          if (message.temp_number === temNumber) {
            message.bot_response = messageResponse;
          }
          return message;
        });
      },
    });
  }

  ngAfterViewChecked(): void {
    if (this._needToScroll) {
      this._scrollToBottom();
      this._needToScroll = false;
    }
  }

  private _scrollToBottom() {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  pushMessage(message: any) {
    this.messages.push(message);
  }

  senderTyping(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.askForm.valid) {
        this.sendAskSubmit();
      }
    }
  }
}
