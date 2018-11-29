import {NgModule} from "@angular/core";
import {RolPipe} from "./rol.pipe";
import {BusPipe} from './bus.pipe';
import {PlacePipe} from './place.pipe';
import {RoutePipe} from './route.pipe';
import {PassengerPipe} from './passenger.pipe';
import {UsuarioPipe} from './usuario.pipe';
import {TranslatePipe} from './translate.pipe';
import {DniPipe} from "./dni.pipe";
import {CompanyPipe} from './company.pipe';
import {CompaniesPipe} from './companies.pipe';
import {PropertyPipe} from './property.pipe';

@NgModule({
    declarations: [RolPipe, BusPipe, PlacePipe, RoutePipe, PassengerPipe, UsuarioPipe, DniPipe, TranslatePipe, CompanyPipe, CompaniesPipe, PropertyPipe],
    exports: [RolPipe, BusPipe, PlacePipe, RoutePipe, PassengerPipe, UsuarioPipe, DniPipe, TranslatePipe, CompanyPipe, CompaniesPipe, PropertyPipe]
})
export class PipesModule {

}
