class DraggableCircle {
  constructor(x, y, r) {
    this.x = x; this.y = y; this.r = r;
    this.dragging = false;
    this.touchId = null;
    this.offsetX = 0; this.offsetY = 0;
  }

  tryGrabAt(px, py, pid) {
    const d = dist(px, py, this.x, this.y);
    if (d < this.r && !this.dragging) {
      this.dragging = true;
      this.touchId = pid;
      this.offsetX = this.x - px;
      this.offsetY = this.y - py;
      return true;
    }
    return false;
  }

  update() {
    if (!this.dragging) return;
    if (this.touchId === "mouse") {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    } else {
      const t = getTouchById(this.touchId);
      if (t) {
        this.x = t.x + this.offsetX;
        this.y = t.y + this.offsetY;
      }
    }
  }

  releaseIf(pid) { if (this.touchId === pid) this.release(); }
  release() { this.dragging = false; this.touchId = null; }

  show() {
    stroke(0);
    fill(this.dragging ? 120 : 200);
    circle(this.x, this.y, this.r * 2);
  }
}
