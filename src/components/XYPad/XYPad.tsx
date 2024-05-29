import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import "./XYPad.scss";
import { useAmbient } from "../../AMBIENT/react";

interface XYPadProps {
  onChangeX: (x: number) => void;
  onChangeY: (y: number) => void;
}

const XYPad: React.FC<XYPadProps> = ({ onChangeX, onChangeY }) => {
  const ambient = useAmbient();
  const touchpadRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const borderSize: number = 8; // Assuming 8px border as per your CSS

  const getEventPosition = (e: MouseEvent | TouchEvent) => {
    let clientX = 0;
    let clientY = 0;
    if (e.type.includes("touch")) {
      const touchEvent = e as TouchEvent;
      clientX = touchEvent.touches[0].clientX;
      clientY = touchEvent.touches[0].clientY;
    } else {
      const mouseEvent = e as MouseEvent;
      clientX = mouseEvent.clientX;
      clientY = mouseEvent.clientY;
    }
    return { clientX, clientY };
  };

  // Set initial offset
  const setInitialPosition = useCallback(() => {
    requestAnimationFrame(() => {
      if (touchpadRef.current && ballRef.current) {
        const touchpadRect = touchpadRef.current.getBoundingClientRect();
        const maxRight = touchpadRect.width - ballRef.current.offsetWidth;
        const maxBottom = touchpadRect.height - ballRef.current.offsetHeight;
        const initialX = ambient.x * maxRight;
        const initialY = (1 - ambient.y) * maxBottom;

        ballRef.current.style.left = `${initialX}px`;
        ballRef.current.style.top = `${initialY}px`;
        onChangeX(ambient.x);
        onChangeY(ambient.y);
      }
    });
  }, [ambient, onChangeX, onChangeY]);

  useLayoutEffect(() => {
    setInitialPosition();
  }, [setInitialPosition]);

  const startDrag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!ballRef.current) return;

    const { clientX, clientY } = getEventPosition(e);

    setIsDragging(true);
    const ballRect = ballRef.current.getBoundingClientRect();
    setOffset({
      x: clientX - ballRect.left,
      y: clientY - ballRect.top,
    });
  }, []);

  const drag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !touchpadRef.current || !ballRef.current) return;

      e.preventDefault(); // Prevent default actions like text selection

      const { clientX, clientY } = getEventPosition(e);

      const touchpadRect = touchpadRef.current.getBoundingClientRect();

      // Adjusted to not subtract borderSize since the border is removed
      let newX = clientX - touchpadRect.left - offset.x;
      let newY = clientY - touchpadRect.top - offset.y;

      // Adjusted calculations to not account for border
      const maxRight = touchpadRect.width - ballRef.current.offsetWidth;
      const maxBottom = touchpadRect.height - ballRef.current.offsetHeight;

      newX = Math.max(0, Math.min(newX, maxRight));
      newY = Math.max(0, Math.min(newY, maxBottom));

      ballRef.current.style.left = `${newX}px`;
      ballRef.current.style.top = `${newY}px`;

      const x = newX / maxRight;
      const y = 1 - newY / maxBottom;

      ambient.x = x;
      ambient.y = y;

      onChangeX(x);
      onChangeY(y);
    },
    [isDragging, offset, onChangeX, onChangeY] // Removed borderSize from dependencies
  );

  const endDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const ball = ballRef.current;
    if (!ball) return;

    const startDragHandler = (e: MouseEvent | TouchEvent) => startDrag(e);
    const dragHandler = (e: MouseEvent | TouchEvent) => drag(e);
    const endDragHandler = () => endDrag();

    // Mouse events
    ball.addEventListener("mousedown", startDragHandler);
    window.addEventListener("mousemove", dragHandler);
    window.addEventListener("mouseup", endDragHandler);

    // Touch events
    ball.addEventListener("touchstart", startDragHandler);
    window.addEventListener("touchmove", dragHandler);
    window.addEventListener("touchend", endDragHandler);

    return () => {
      ball.removeEventListener("mousedown", startDragHandler);
      window.removeEventListener("mousemove", dragHandler);
      window.removeEventListener("mouseup", endDragHandler);

      ball.removeEventListener("touchstart", startDragHandler);
      window.removeEventListener("touchmove", dragHandler);
      window.removeEventListener("touchend", endDragHandler);
    };
  }, [startDrag, drag, endDrag]);

  return (
    <div ref={touchpadRef} className="touchpad glassmorphic">
      {/* <img src={ship} ref={ballRef} className="ball" /> */}
      <div ref={ballRef} className="ball" />
      <div className="vertical-text">warmth</div>
      <div className="bottom-text">dimension</div>
    </div>
  );
};

export default XYPad;
