import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QuestionMessage } from 'src/app/models/QuestionMessage';

@Component({
  selector: 'app-dialog-question',
  templateUrl: './dialog-question.component.html',
  styleUrls: ['./dialog-question.component.css']
})
export class DialogQuestionComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<DialogQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuestionMessage
  ) {

  }

  ngOnInit() {}
}
