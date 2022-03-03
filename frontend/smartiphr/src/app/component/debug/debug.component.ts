import { Component, OnInit } from "@angular/core";
import { DebugService } from "src/app/service/debug.service";

@Component({
  selector: "app-debug",
  templateUrl: "./debug.component.html",
  styleUrls: ["./debug.component.css"],
})
export class DebugComponent implements OnInit {
  private isDown;
  private dialogBoxDiv;
  private dragOffset;

  constructor(private debugService: DebugService) {
    this.isDown = false;
    this.dragOffset = [0, 0];
  }

  ngOnInit() {
    this.dialogBoxDiv = document.getElementById("dialog-debug");
  }

  getVariables() {
    return this.debugService.getVariables();
  }

  getValue(key: string) {
    return this.debugService.getValue(key);
  }

  deleteVariable(key: string) {
    this.debugService.removeVariable(key);
  }

  mousedown($event) {
    this.isDown = true;
    this.dragOffset = [
      this.dialogBoxDiv.offsetLeft - $event.clientX,
      this.dialogBoxDiv.offsetTop - $event.clientY,
    ];
  }

  mousemove($event) {
    $event.preventDefault();

    if (this.isDown) {
      var mousePosition = {
        x: $event.clientX,
        y: $event.clientY,
      };

      this.dialogBoxDiv.style.left =
        mousePosition.x + this.dragOffset[0] + "px";
      this.dialogBoxDiv.style.top = mousePosition.y + this.dragOffset[1] + "px";
    }
  }

  mouseup($event) {
    this.isDown = false;
  }
}
