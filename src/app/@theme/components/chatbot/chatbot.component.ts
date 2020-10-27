import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { IChatbotAPI } from './api/chatbot-api.interface';
import { IRegistrationModel, RegistrationFormComponent } from './registration-form/registration-form.component';
import { faChevronCircleDown, faMicrophone, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { AudioRecordingServiceService } from './services/audio-recording/audio-recording-service.service';
import { takeLast, takeWhile } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export interface Message {
  from: string;
  self: boolean;
  type: 'text' | 'audio';
  content?: string;
  audio?: string | SafeResourceUrl;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  providers: [AudioRecordingServiceService]
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('scrollArea') scrollArea: ElementRef;

  @Input() title: string;
  @Input() messages: Message[] = [];
  @Input() botName = 'Chabot';
  @Input() api: IChatbotAPI;
  @Input() apiIdName = 'telegramId';
  @Input() scrollDelay = 10;
  @Input() scrollerBottomMargin = 40;
  @Input() scrollerRightMargin = 50;
  @Input() scrollerShowMargin = 40;

  faChevronCircleDown = faChevronCircleDown;
  faMicrophone = faMicrophone;
  faTimes = faTimes;
  faCheck = faCheck;

  currentMessage: string;
  registered = false;
  scrollerPosition: { bottom: number, right: number } = {
    bottom: 0,
    right: 0
  };
  showScroller = false;
  scrolling = false;
  recordStatus: { recording: boolean, time: string } = {
    recording: false,
    time: '00:00',
  };
  alive = true;

  constructor(
    private modalService: NgbModal,
    private audioRecordingService: AudioRecordingServiceService,
    private sanitizer: DomSanitizer,
    private changeDectectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!this.api) {
      throw new Error(
        'This component requires an API implementation,' +
        ' provide one via the \'api\' variable. ' +
        'If you wish, a default implementation is avaible.'
      );
    }
    if (!localStorage.getItem(this.apiIdName)) {
      this.register();
    } else {
      this.registered = true;
    }
    // Subscribe to the audio observables
    this.audioRecordingService.getRecordedTime().pipe(
      takeWhile(() => this.alive)).subscribe((time) => {
        this.recordStatus.time = time;
      });
    this.audioRecordingService.getRecordedBlob().pipe(
      takeWhile(() => this.alive)).subscribe((result) => {
        this.sendAudio(result.blob, result.title);
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  sendMessage(message?: string): void {
    if (message) {
      this.currentMessage = message;
    }
    if (this.canSendMessage()) {
      return;
    }
    // Visual feedback
    this.messages.push({
      from: '',
      self: true,
      type: 'text',
      content: this.currentMessage
    });
    if (!this.showScroller) {
      // We only scroll to the bottom, if the user is already at the last message
      this.scrollToBottom();
    }
    // Send message to the API
    this.api.sendMessage(this.currentMessage, localStorage.getItem(this.apiIdName)).subscribe(
      (event) => {
        this.messages.push({
          from: this.botName,
          self: false,
          type: 'text',
          content: event.response
        });
        this.scrollToBottom();
      });
    this.currentMessage = '';
  }

  sendAudio(data: Blob, audioName: string): void {
    // Visual feedback
    this.messages.push({
      from: '',
      self: true,
      type: 'audio',
      audio: this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(data))
    });

    if (!this.showScroller) {
      // We only scroll to the bottom, if the user is already at the last message
      this.scrollToBottom();
    }
    // Send message to the API
    this.api.sendAudio(
      data,
      audioName,
      localStorage.getItem(this.apiIdName)).subscribe(
        (event) => {
          this.messages.push({
            from: this.botName,
            self: false,
            type: 'text',
            content: event.response
          });
          this.scrollToBottom();
          this.changeDectectorRef.detectChanges();
        });
    this.changeDectectorRef.detectChanges();
  }

  startRecording(): void {
    this.recordStatus.recording = true;
    this.audioRecordingService.startRecording();
  }

  stopRecording(): void {
    this.recordStatus.recording = false;
    this.audioRecordingService.abortRecording();
  }

  saveRecording(): void {
    this.recordStatus.recording = false;
    this.audioRecordingService.stopRecording();
  }

  register(): void {
    const modalRef = this.modalService.open(RegistrationFormComponent);
    from(modalRef.result).subscribe((result: IRegistrationModel) => {
      this.api.startSession(result.name, result.email).subscribe((event) => {
        this.registered = true;
        localStorage.setItem(this.apiIdName, event.response);
      });
    }, () => {
      this.registered = false;
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.showScroller = false;
      this.scrolling = true;
      this.scrollArea.nativeElement.scrollTop = this.scrollArea.nativeElement.scrollHeight;
      this.repositionateScroller();
    }, this.scrollDelay); // Gives a delay to start the scrolling
  }

  @HostListener('window:resize', ['$event'])
  @HostListener('window:scroll', ['$event'])
  repositionateScroller(): void {
    const rect = this.scrollArea.nativeElement.getBoundingClientRect();
    this.scrollerPosition.bottom = rect.bottom - this.scrollerBottomMargin;
    this.scrollerPosition.right = rect.right - this.scrollerRightMargin;
  }

  shouldShowScroller(): void {
    if (this.scrolling) {
      this.scrolling = this.scrollArea.nativeElement.scrollTop !== this.scrollArea.nativeElement.scrollTopMax;
    } else {
      this.showScroller = this.scrollArea.nativeElement.scrollTop < this.scrollArea.nativeElement.scrollTopMax - this.scrollerShowMargin;
    }
  }

  canSendMessage(): boolean {
    return !this.currentMessage || !this.registered || this.recordStatus.recording
  }
}
