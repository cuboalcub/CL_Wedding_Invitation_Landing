import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, LottieComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements AfterViewInit {
  options: AnimationOptions = {
    path: '/assets/animations/Wind.json',
    autoplay: true,
    loop: true
  };

  showLetter = false;
  isPlaying = false;
  showEnvelope = true;
  envelopeOpening = false;

  openEnvelope() {
    if (this.envelopeOpening) return;
    this.envelopeOpening = true;
    // Tras la animación de apertura, ocultamos el sobre y mostramos el contenido
    setTimeout(() => {
      this.showEnvelope = false;
    }, 1400);
  }

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  ngAfterViewInit() {
    const audio = this.audioPlayer.nativeElement;
    audio.volume = 0.25;

    // Los navegadores bloquean autoplay sin interacción previa del usuario.
    // Intentamos reproducir de inmediato; si falla, esperamos el primer click.
    audio.play().then(() => {
      this.isPlaying = true;
    }).catch(() => {
      const startOnInteraction = () => {
        audio.play().then(() => {
          this.isPlaying = true;
        }).catch(() => {});
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('keydown', startOnInteraction);
      };
      document.addEventListener('click', startOnInteraction);
      document.addEventListener('keydown', startOnInteraction);
    });
  }

  toggleView() {
    this.showLetter = !this.showLetter;
  }

  toggleMusic() {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      if (this.isPlaying) {
        this.audioPlayer.nativeElement.pause();
      } else {
        // Enforce user interaction by ensuring play comes from a click
        this.audioPlayer.nativeElement.play().catch(e => console.error("Audio play failed:", e));
      }
      this.isPlaying = !this.isPlaying;
    }
  }

}
