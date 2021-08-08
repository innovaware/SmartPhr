import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PisicologicaComponent } from "./pages/pisicologica/pisicologica.component";

const routes: Routes = [
  { path: "pisicologica", component: PisicologicaComponent }, // Wildcard route for a 404 page

  //  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
