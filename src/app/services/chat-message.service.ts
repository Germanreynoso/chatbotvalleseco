import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponseSendMessage } from '../interfaces/messages';
import { Observable } from 'rxjs';
import { getSessionId } from './session.util';

@Injectable({
  providedIn: 'root',
})
export class ChatMessageService {
  private _http = inject(HttpClient);

  constructor() {
    console.log('ChatMessageService constructor');
  }

  sendMessage(message: any): Observable<IResponseSendMessage> {
    // Validación: asegurarse de que siempre se envía session_id
    if (!message.sessionId) {
      message.sessionId = getSessionId();
    }
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const url: string = environment.webhookUrl;
    return this._http.post<IResponseSendMessage>(url, message, { headers });
  }
}
