import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChatbotAPI, IChatbotResponse } from '../chatbot-api.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class DefaultChatbotApiService implements IChatbotAPI {
  constructor(private http: HttpClient) { }

  sendMessage(message: string, apiId: string): Observable<IChatbotResponse> {
    return this.http.post<IChatbotResponse>(`${environment.apiUrl}/messages`, {
      message,
      id: apiId
    });
  }

  sendAudio(blob: Blob, audioName: string, apiId: string): Observable<IChatbotResponse> {
    const formData = new FormData();
    formData.append('audio', blob, audioName);
    formData.append('id', apiId);
    return this.http.post<IChatbotResponse>(`${environment.apiUrl}/audios`, formData);
  }

  startSession(name: string, email: string): Observable<IChatbotResponse> {
    return this.http.post<IChatbotResponse>(`${environment.apiUrl}/start`, {
      name,
      email
    });
  }
}
