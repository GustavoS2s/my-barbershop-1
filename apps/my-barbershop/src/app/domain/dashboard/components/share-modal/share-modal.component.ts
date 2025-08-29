import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { Component, inject, Inject } from '@angular/core';

@Component({
  selector: 'mb-share-modal',
  standalone: true,
  imports: [NzQRCodeModule, NzInputModule, NzButtonModule, NzIconModule, NzDividerModule, NzFlexModule, NzTypographyModule],
  template: `
    <nz-flex nzVertical nzGap="large" nzAlign="center">
      <div style="text-align: center;">
        <h3>QR Code</h3>
        <p nz-typography nzType="secondary">Escaneie o código para acessar a página</p>
        <nz-qrcode [nzValue]="shareUrl" [nzSize]="200"></nz-qrcode>
      </div>

      <nz-divider></nz-divider>

      <div style="width: 100%;">
        <h3>Link direto</h3>

        <nz-input-group nzSearch [nzAddOnAfter]="suffixButton">
          <input nz-input [value]="shareUrl" readonly />
        </nz-input-group>
        <ng-template #suffixButton>
          <button nz-button nzType="primary" nzSearch (click)="copyShareLink()">
            <i nz-icon nzType="copy"></i>
            Copiar
          </button>
        </ng-template>
      </div>
    </nz-flex>
  `,
})
export class ShareModalComponent {
  private messageService = inject(NzMessageService);

  shareUrl = '';

  constructor(@Inject(NZ_MODAL_DATA) private data: { storefrontId: string }) {
    if (this.data?.storefrontId) {
      this.shareUrl = `${window.location.origin}/view/${this.data.storefrontId}`;
    } else {
      this.shareUrl = `${window.location.origin}/view`;
    }
  }

  copyShareLink() {
    navigator.clipboard.writeText(this.shareUrl).then(() => {
      this.messageService.success('Link copiado para a área de transferência!');
    });
  }
}
