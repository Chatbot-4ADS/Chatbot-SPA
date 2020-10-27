import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as RecordRTC from 'recordrtc';

export interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable()
export class AudioRecordingServiceService {
  private stream: MediaStream;
  private recorder: RecordRTC;
  private interval: number;
  private startTime: number;
  private recorded = new Subject<any>();
  private recordingTime = new Subject<string>();
  private recordingFailed = new Subject<string>();

  constructor() { }

  private record(): void {
    this.recorder = new RecordRTC(this.stream, {
      type: 'audio',
      mimeType: 'audio/webm'
    });

    this.recorder.startRecording();
    this.startTime = Date.now();
    this.interval = setInterval(
      () => {
        const currentTime = Date.now();
        const seconds = Math.floor((currentTime - this.startTime) / 1000);
        const minutes = Math.floor(seconds / 60);
        this.recordingTime.next(minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0'));
      },
      1000
    );
  }

  private stopMedia(): void {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach(track => track.stop());
        this.stream = null;
      }
    }
  }

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this.recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this.recordingTime.asObservable();
  }

  getRecordingFailed(): Observable<string> {
    return this.recordingFailed.asObservable();
  }

  startRecording(): void {
    if (this.recorder) {
      return;
    }

    this.recordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      this.stream = s;
      this.record();
    }).catch((error) => {
      this.recordingFailed.next();
    });

  }

  stopRecording(): void {
    if (this.recorder) {
      this.recorder.stopRecording(() => {
        const blob = this.recorder.getBlob();
        if (blob) {
          if (this.startTime) {
            const mp3Name = encodeURIComponent('audio_' + new Date().getTime() + '.mp3');
            this.stopMedia();
            this.recorded.next({ blob, title: mp3Name });
          }
        } else {
          this.stopMedia();
          this.recordingFailed.next();
        }
      });
    }
  }

  abortRecording(): void {
    this.stopMedia();
  }
}
