export class DraggableBall {
  private touchpad: HTMLElement;
  private ball: HTMLElement;
  private isDragging: boolean = false;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private borderSize: number = 8; // Assuming 8px border as per your CSS
  private onChangeX: (x: number) => void;
  private onChangeY: (y: number) => void;

  constructor(
    touchpadSelector: string,
    ballSelector: string,
    onChangeX: (x: number) => void,
    onChangeY: (y: number) => void
  ) {
    this.onChangeX = onChangeX;
    this.onChangeY = onChangeY;
    this.touchpad = document.querySelector(touchpadSelector) as HTMLElement;
    this.ball = document.querySelector(ballSelector) as HTMLElement;

    this.initDraggableBall();
  }

  private initDraggableBall(): void {
    this.ball.addEventListener("mousedown", (e) => this.startDrag(e));
    window.addEventListener("mousemove", (e) => this.drag(e));
    window.addEventListener("mouseup", () => this.endDrag());
  }

  private startDrag(e: MouseEvent): void {
    this.isDragging = true;

    const ballRect = this.ball.getBoundingClientRect();
    this.offsetX = e.clientX - ballRect.left;
    this.offsetY = e.clientY - ballRect.top;
  }

  private drag(e: MouseEvent): void {
    if (!this.isDragging) return;

    e.preventDefault(); // Prevent default actions like text selection

    const touchpadRect = this.touchpad.getBoundingClientRect();

    // Calculate the new position, considering the offset and border
    let newX = e.clientX - touchpadRect.left - this.offsetX - this.borderSize;
    let newY = e.clientY - touchpadRect.top - this.offsetY - this.borderSize;

    // Constrain the ball within the touchpad's content area, accounting for the border
    const maxRight =
      touchpadRect.width - this.ball.offsetWidth - this.borderSize * 2;
    const maxBottom =
      touchpadRect.height - this.ball.offsetHeight - this.borderSize * 2;

    newX = Math.max(0, Math.min(newX, maxRight));
    newY = Math.max(0, Math.min(newY, maxBottom));

    // Update the ball's position
    this.ball.style.left = `${newX}px`;
    this.ball.style.top = `${newY}px`;

    // Normalize and log the position values
    const x = newX / maxRight;
    const y = 1 - newY / maxBottom;

    this.onChangeX(x);
    this.onChangeY(y);
  }

  private endDrag(): void {
    this.isDragging = false;
  }
}
