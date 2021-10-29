import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { Curriculum } from "src/app/models/curriculum";
import { Dipendenti } from "src/app/models/dipendenti";
import { CurriculumService } from "src/app/service/curriculum.service";
import { UploadService } from "src/app/service/upload.service";
import { MessagesService } from "src/app/service/messages.service";

@Component({
  selector: "app-dialog-cv",
  templateUrl: "./dialog-cv.component.html",
  styleUrls: ["./dialog-cv.component.css"],
})
export class DialogCvComponent implements OnInit {
  nuovoCurriculum: Curriculum;
  uploadingCV: boolean;

  constructor(
    public messageService: MessagesService,
    public uploadService: UploadService,
    public dialogRef: MatDialogRef<DialogCvComponent>,
    private curriculumService: CurriculumService
  ) {
    this.nuovoCurriculum = new Curriculum();
    this.uploadingCV = false;
  }

  ngOnInit() {}

  uploadCV($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload bonifico: ", $event);
      this.nuovoCurriculum.filename = file.name;
      this.nuovoCurriculum.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async save() {
    const typeDocument = "CURRICULUM";
    const path = "curriculum";
    const file: File = this.nuovoCurriculum.file;
    this.uploadingCV = true;

    console.log("Invio curriculum: ", this.nuovoCurriculum);
    this.curriculumService.insert(this.nuovoCurriculum).subscribe(
      (result: Curriculum) => {
        console.log("Insert curriculum: ", result);

        let formData: FormData = new FormData();
        const nameDocument: string = this.nuovoCurriculum.filename;

        formData.append("file", file);
        formData.append("typeDocument", typeDocument);
        formData.append("path", `${path}`);
        formData.append("name", nameDocument);
        this.uploadService
          .uploadDocument(formData)
          .then((x) => {
            this.uploadingCV = false;

            console.log("Uploading completed: ", x);
            this.dialogRef.close(this.nuovoCurriculum);
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore nel caricamento file");
            console.error(err);
          });
      },
      (err) => {
        this.messageService.showMessageError("Errore Inserimento fattura");
        console.error(err);
      }
    );
  }
}
