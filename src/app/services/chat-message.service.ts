import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponseSendMessage } from '../interfaces/messages';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatMessageService {
  private _http = inject(HttpClient);

  constructor() {
    console.log('ChatMessageService constructor');
  }

  sendMessage(message: any): Observable<IResponseSendMessage> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const url: string = `${environment.urlBase}/api/valleseco/chatbot-web`; 
    return this._http.post<IResponseSendMessage>(url, message, { headers });
  }
}
