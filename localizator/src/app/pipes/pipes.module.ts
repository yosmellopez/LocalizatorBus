import {NgModule} from "@angular/core";
import {RolPipe} from "./rol.pipe";
import {BusPipe} from './bus.pipe';
import {PlacePipe} from './place.pipe';
import {RoutePipe} from './route.pipe';
import {PassengerPipe} from './passenger.pipe';
import {UsuarioPipe} from './usuario.pipe';

@NgModule({
    declarations: [RolPipe, BusPipe, PlacePipe, RoutePipe, PassengerPipe, UsuarioPipe],
    exports: [RolPipe, BusPipe, PlacePipe, RoutePipe, PassengerPipe, UsuarioPipe]
})
export class PipesModule {

}
