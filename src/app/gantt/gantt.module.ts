import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GanttComponent } from './gantt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GanttService } from './gantt.service';

@NgModule({
  declarations: [
    GanttComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    GanttService,
    DatePipe
  ],
  exports: [
    GanttComponent,
  ],
})
export class GanttModule { }
