import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  @Output() uploadEmit = new EventEmitter();
  @Input() url: string;
  @Input() accept: string;

  fileToUpload: File = null;
  showUploadForm: boolean;
  uploading: boolean;

  constructor(
    // public checklistService: ChecklistService,
  ) {

    this.showUploadForm = false;
    this.uploading = false;
  }

  ngOnInit(): void {
  }



  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  async uploadPDF() {
    this.uploading = true;
    // this.checklistService.postFile(this.fileToUpload, this.url).subscribe(data => {
    //   // do something, if upload success
    //   this.showUploadForm = true;
    //   this.uploading = false;

    //   this.uploadEmit.emit(this.fileToUpload.name);


    // }, error => {
    //   console.log(error);
    //   this.uploading = false;
    //   this.showUploadForm = true;

    //   this.uploadEmit.emit(error);
    // });
  }
}
