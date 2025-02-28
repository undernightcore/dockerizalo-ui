import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TemplateInterface } from '../../interfaces/template.interface';

@Injectable({
  providedIn: 'root',
})
export class TemplatesService {
  #http = inject(HttpClient);

  getTemplates() {
    return this.#http.get<TemplateInterface[]>(
      `${environment.apiUrl}/templates`
    );
  }
}
