import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
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
    private curriculumService: CurriculumService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cv: Curriculum,
      disabled: Boolean,
      new: Boolean
    }
  ) {
    this.dialogRef.addPanelClass('fornitore-dialog-container');
    this.dialogRef.updateSize('90%', '90%');
    this.dialogRef.updatePosition({ top: '24px' });
    this.nuovoCurriculum = new Curriculum();
    if (data.disabled) this.nuovoCurriculum = data.cv;
    else this.nuovoCurriculum.status = "Da Valutare";
    this.uploadingCV = false;
  }

  ngOnInit() { }

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

  async save(type: string = "save") {

    if (this.data.new) {
      if (!this.nuovoCurriculum.file) {
        this.messageService.showMessageError("Inserire File");
        return;
      }
      if (!this.nuovoCurriculum.nome) {
        this.messageService.showMessageError("Inserire Nome");
        return;
      }
      if (!this.nuovoCurriculum.cognome) {
        this.messageService.showMessageError("Inserire Cognome");
        return;
      }
      if (!this.nuovoCurriculum.codiceFiscale) {
        this.messageService.showMessageError("Inserire Codice Fiscale");
        return;
      }
      if (!this.nuovoCurriculum.mansione) {
        this.messageService.showMessageError("Inserire Mansione");
        return;
      }

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
          this.messageService.showMessageError("Errore Inserimento CV");
          console.error(err);
        }
      );
    }

    else {
      this.curriculumService.update(this.nuovoCurriculum).subscribe(
        (result: Curriculum) => { },
        (err) => {
          this.messageService.showMessageError("Errore modifica CV");
          console.error(err);
        });
    }

  }
}
