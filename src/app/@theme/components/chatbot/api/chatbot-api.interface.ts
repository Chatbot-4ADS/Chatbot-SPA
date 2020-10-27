import { Observable } from 'rxjs';

export interface IChatbotResponse {
    response: string;
}

export interface IChatbotAPI {
    sendMessage(message: string, apiId: string): Observable<IChatbotResponse>;
    sendAudio(blob: Blob, audioName: string, apiId: string): Observable<IChatbotResponse>;
    startSession(name: string, email: string): Observable<IChatbotResponse>;
}
