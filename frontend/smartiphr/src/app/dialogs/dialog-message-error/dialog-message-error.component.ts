import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: "app-dialog-message-error",
  templateUrl: "./dialog-message-error.component.html",
  styleUrls: ["./dialog-message-error.component.css"],
})
export class DialogMessageErrorComponent implements OnInit {
  public safeHtmlMessage: SafeHtml;

  constructor(
    public dialogRef: MatDialogRef<DialogMessageErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    // Replace all newline characters with <br/>
    const htmlMessage = this.message.replace(/\n/g, "<br/>");
    // Sanitize the HTML content
    this.safeHtmlMessage = this.sanitizer.bypassSecurityTrustHtml(htmlMessage);
  }
}
