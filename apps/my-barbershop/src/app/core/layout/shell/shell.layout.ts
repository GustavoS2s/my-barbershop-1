import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@domain/auth/services/auth.service';
import { CompanyService } from '@shared/services/company/company.service';

@Component({
  selector: 'mb-shell',
  imports: [RouterModule, NzFlexModule, NzLayoutModule, NzMenuModule, NzDropDownModule, NzAvatarModule, NzIconModule],
  templateUrl: './shell.layout.html',
  styleUrl: './shell.layout.scss',
})
export class ShellLayout {
  protected authService = inject(AuthService);
  protected companyService = inject(CompanyService);

  showHeader = computed(() => this.authService.isLoggedIn());

  async handleSignOut() {
    await this.authService.purgeAndRedirect();
  }
}
