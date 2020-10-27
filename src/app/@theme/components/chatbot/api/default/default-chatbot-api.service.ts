import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChatbotAPI, IChatbotResponse } from '../chatbot-api.interface';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DefaultChatbotApiService implements IChatbotAPI {
  readonly url = 'http://fernandoabueno.freeddns.org:4567';

  constructor(private http: HttpClient) { }

  sendMessage(message: string, apiId: string): Observable<IChatbotResponse> {
    return this.http.post<IChatbotResponse>(`${this.url}/messages`, {
      message,
      id: apiId
    });
  }

  sendAudio(blob: Blob, audioName: string, apiId: string): Observable<IChatbotResponse> {
    const formData = new FormData();
    formData.append('audio', blob, audioName);
    formData.append('id', apiId);
    return this.http.post<IChatbotResponse>(`${this.url}/audios`, formData);
  }

  startSession(name: string, email: string): Observable<IChatbotResponse> {
    return this.http.post<IChatbotResponse>(`${this.url}/start`, {
      name,
      email
    });
  }
}
