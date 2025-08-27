import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IMessage } from '../../interfaces/messages';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css'],
  imports: [CommonModule]
})
export class ChatMessagesComponent implements AfterViewInit {
  @Input() messages: IMessage[] = [];
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnChanges() {
    // Desplazarse al fondo cuando hay nuevos mensajes
    if (this.messageContainer) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  private scrollToBottom(): void {
    try {
      const container = this.messageContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch(err) { 
      console.error('Error al hacer scroll:', err);
    }
  }

  trackByIndex(index: number, item: IMessage): number {
    return index;
  }
}