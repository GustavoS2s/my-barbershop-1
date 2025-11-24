import { NzNotificationService } from 'ng-zorro-antd/notification';
import { filter, first, interval } from 'rxjs';

import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class PwaUpdateService {
  constructor(
    private swUpdate: SwUpdate,
    private appRef: ApplicationRef,
    private notification: NzNotificationService,
  ) {}

  /**
   * Inicializa o serviço de atualização do PWA
   * Verifica atualizações periodicamente e notifica o usuário
   */
  init(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('Service Worker não está habilitado');
      return;
    }

    // Verifica atualizações quando o app estabiliza
    this.checkForUpdatesOnStable();

    // Verifica atualizações a cada 6 horas
    this.checkForUpdatesInterval();

    // Notifica quando uma nova versão está pronta
    this.notifyOnVersionReady();
  }

  /**
   * Verifica atualizações quando o app estabiliza
   */
  private checkForUpdatesOnStable(): void {
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));

    appIsStable$.subscribe(() => {
      this.swUpdate.checkForUpdate().then(updateAvailable => {
        if (updateAvailable) {
          console.log('Nova versão disponível');
        }
      });
    });
  }

  /**
   * Verifica atualizações a cada 6 horas
   */
  private checkForUpdatesInterval(): void {
    interval(6 * 60 * 60 * 1000).subscribe(() => {
      this.swUpdate.checkForUpdate().then(updateAvailable => {
        if (updateAvailable) {
          console.log('Nova versão disponível (verificação periódica)');
        }
      });
    });
  }

  /**
   * Notifica o usuário quando uma nova versão está pronta
   */
  private notifyOnVersionReady(): void {
    this.swUpdate.versionUpdates.pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')).subscribe(() => {
      this.showUpdateNotification();
    });
  }

  /**
   * Exibe notificação de atualização disponível
   */
  private showUpdateNotification(): void {
    this.notification.create('info', 'Nova versão disponível', 'Uma nova versão do aplicativo está disponível. Recarregue a página para atualizar.', {
      nzDuration: 0,
      nzPlacement: 'bottomRight',
      nzKey: 'pwa-update',
    });

    // Auto-atualiza após 5 segundos
    setTimeout(() => {
      this.activateUpdate();
    }, 5000);
  }

  /**
   * Ativa a nova versão e recarrega a página
   */
  private activateUpdate(): void {
    this.swUpdate.activateUpdate().then(() => {
      document.location.reload();
    });
  }

  /**
   * Força a verificação de atualizações
   */
  checkForUpdates(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();
    }
  }
}
