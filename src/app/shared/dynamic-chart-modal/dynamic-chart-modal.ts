import { Component,Inject } from '@angular/core';
import {CommonModule} from '@angular/common'
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog'
import {MatButtonModule}from '@angular/material/button';
import {DynamicChart} from '../../pages/dynamic-chart/dynamic-chart';
import { Dialog } from '@angular/cdk/dialog';
import { DynamicChartModalData } from '../../models/report-interfaces';


@Component({
  selector: 'app-dynamic-chart-modal',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    DynamicChart
  ],
  templateUrl: './dynamic-chart-modal.html',
  styleUrl: './dynamic-chart-modal.scss',
})
export class DynamicChartModal {


constructor(
  private dialogRef:MatDialogRef<DynamicChartModal>,
  @Inject(MAT_DIALOG_DATA)
  public data:DynamicChartModalData
){}


  close():void{
    
    this.dialogRef.close();
  }

}
