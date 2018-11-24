import {Pipe, PipeTransform} from '@angular/core';
import {Company} from "../app.model";
import {TranslateService} from "../services/translate.service";

@Pipe({name: 'companies'})
export class CompaniesPipe implements PipeTransform {
    constructor(private translate: TranslateService) {
    }

    transform(companies: Company[], args?: any): any {
        if (companies && companies.length !== 0) {
            return companies.map(company => company.name).join(", ");
        }
        return this.translate.translate("noCompanies");
    }

}
