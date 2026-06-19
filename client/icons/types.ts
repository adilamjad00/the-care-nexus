export type IconEasing = "linear" | "easeIn" | "easeOut" | "easeInOut" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" | "backInOut" | "anticipate" | "easeInOvershoot" | "easeOutOvershoot" | "easeInOutOvershoot" | string | any;

export interface AnimatedIconProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    className?: string;
}

export interface AnimatedIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}
