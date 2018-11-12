import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class TranslateService {
    data: any = {};

    constructor(private http: HttpClient) {
        this.use(localStorage.getItem("lang") || "es");
    }

    use(lang: string): Promise<{}> {
        return new Promise<{}>((resolve, reject) => {
            const langPath = `assets/i18n/${lang || 'en'}.json`;
            this.http.get<{}>(langPath).subscribe(
                translation => {
                    this.data = Object.assign({}, translation || {});
                    resolve(this.data);
                },
                error => {
                    this.data = {};
                    resolve(this.data);
                }
            );
        });
    }

    translate(key: string) {
        let split: any[] = key.split(".");
        let currentObject: any = null;
        split.forEach(string => {
            if (!currentObject)
                currentObject = this.data[string];
            else
                currentObject = currentObject[string];
        });
        return currentObject || key;
    }
}
