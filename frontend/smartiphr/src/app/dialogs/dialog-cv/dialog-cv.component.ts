import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
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
  addingCV: boolean;
  uploadingCV: boolean;
  nuovoCv: Curriculum;

  constructor(
    public messageService: MessagesService,
    public uploadService: UploadService,
    private curriculumService: CurriculumService,
    @Inject(MAT_DIALOG_DATA)
    public item: {
      dipendente: Dipendenti;
      isNew: boolean;
      readonly: boolean;
    }
  ) {
    this.uploadingCV = false;
    this.addingCV = false;
    this.curriculum = [];
    this.curriculumService.get(this.item.dipendente._id).subscribe(
      x=> {
        this.curriculum = x;
        this.dataSource = new MatTableDataSource<Curriculum>(this.curriculum);
        this.dataSource.paginator = this.paginator;
      });
  }

  displayedColumns: string[] = ["nome", "data", "action"];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: MatTableDataSource<Curriculum>;
  curriculum: Curriculum[];

  ngOnInit() {}

  async show(curriculum: Curriculum) {
    this.uploadService
      .download(curriculum.filename, this.item.dipendente._id, "curriculum")
      .then((x) => {
        console.log("download: ", x);
        x.subscribe((data) => {
          console.log("download: ", data);
          const newBlob = new Blob([data as BlobPart], {
            type: "application/pdf",
          });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
          }

          // For other browsers:
          // Create a link pointing to the ObjectURL containing the blob.
          const downloadURL = URL.createObjectURL(newBlob);
          window.open(downloadURL);
        });
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento file");
        console.error(err);
      });
  }

  async addCV() {
    this.addingCV = true;
    this.nuovoCv = {
      filename: undefined,
      note: "",
    };
  }

  async uploadCV($event) {
    let fileList: FileList = $event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];

      console.log("upload fattura: ", $event);
      this.nuovoCv.filename = file.name;
      this.nuovoCv.file = file;
    } else {
      this.messageService.showMessageError("File non valido");
      console.error("File non valido o non presente");
    }
  }

  async saveCV(curriculum: Curriculum) {
    const typeDocument = "CURRICULUM";
    const path = "curriculum";
    const file: File = curriculum.file;
    this.uploadingCV = true;
    this.addingCV = true;

    console.log("Invio curriculum: ", curriculum);
    this.curriculumService
      .insert(curriculum, this.item.dipendente._id)
      .subscribe(
        (result: Curriculum) => {
          console.log("Insert curriculum: ", result);

          let formData: FormData = new FormData();
          const nameDocument: string = curriculum.filename;

          formData.append("file", file);
          formData.append("typeDocument", typeDocument);
          formData.append("path", `${this.item.dipendente._id}/${path}`);
          formData.append("name", nameDocument);
          this.uploadService
            .uploadDocument(formData)
            .then((x) => {
              this.curriculum.push(result);
              this.dataSource.data = this.curriculum;
              this.addingCV = false;
              this.uploadingCV = false;

              console.log("Uploading completed: ", x);
            })
            .catch((err) => {
              this.messageService.showMessageError(
                "Errore nel caricamento file"
              );
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
