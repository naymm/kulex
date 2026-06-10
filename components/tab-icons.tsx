import Svg, { Path, Rect, Circle } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
};

export function InicioIcon({ size = 24, color = '#8E8E8E' }: IconProps) {
  const width = (size * 47) / 60;

  return (
    <Svg width={width} height={size} viewBox="0 0 47 60" fill="none">
      <Path
        d="M12.3496 1.08008L12.3429 58.9197L1.00781 58.8909L1.02797 1.09448L12.3496 1.08008Z"
        stroke={color}
        strokeWidth={3}
        strokeMiterlimit={10}
      />
      <Path
        d="M33.9649 30.1081L45.9988 19.5152C46.6237 18.9679 46.9529 18.2694 47 17.4052V3.85265C46.9932 2.74367 46.4154 1.84353 45.636 1.41866C44.7423 0.93618 43.6807 0.950582 42.8543 1.6707L17.4024 24.1023C13.8077 27.2708 14.0496 33.2045 17.5838 36.3154L42.9148 58.5886C43.7345 59.3087 44.8364 59.2727 45.683 58.7758C46.4691 58.3078 46.9932 57.4076 46.9932 56.3274V42.8325C46.9462 41.99 46.6842 41.3202 46.1265 40.8234L33.9649 30.1081ZM34.3412 12.5444L44.5408 3.5934L44.5744 17.398L32.4666 28.0413C29.0533 22.8493 29.9536 16.8507 34.3412 12.5444ZM44.5273 56.6371L19.398 34.5368C18.1012 33.507 17.3554 32.0092 17.2747 30.4393C17.1807 28.6966 17.819 27.0764 19.109 25.9458L28.3343 17.8805C27.649 21.2434 27.911 24.3471 29.228 27.2852C30.0141 29.1071 31.069 30.6121 32.3658 32.0884L44.5609 42.8181L44.5273 56.6371Z"
        fill={color}
      />
    </Svg>
  );
}

export function CartaoIcon({ size = 24, color = '#8E8E8E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3}
        y={6}
        width={18}
        height={12}
        rx={2}
        stroke={color}
        strokeWidth={1.75}
      />
      <Rect x={5} y={9} width={4} height={3} rx={0.5} fill={color} />
      <Rect x={14} y={13} width={5} height={2} rx={0.5} fill={color} />
    </Svg>
  );
}

export function PagamentosArrowsIcon({ size = 22, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 9h12M15 6l3 3-3 3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 15H7M9 12l-3 3 3 3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CreditoIcon({ size = 24, color = '#8E8E8E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={5}
        y={8}
        width={14}
        height={9}
        rx={1.5}
        stroke={color}
        strokeWidth={1.75}
      />
      <Circle cx={12} cy={12.5} r={2.25} stroke={color} strokeWidth={1.75} />
      <Path
        d="M4 19h16"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MenuIcon({ size = 24, color = '#8E8E8E' }: IconProps) {
  const s = 4;
  const gap = 3;
  const offset = (size - s * 2 - gap) / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Rect x={offset} y={offset} width={s} height={s} rx={0.75} fill={color} />
      <Rect
        x={offset + s + gap}
        y={offset}
        width={s}
        height={s}
        rx={0.75}
        fill={color}
      />
      <Rect
        x={offset}
        y={offset + s + gap}
        width={s}
        height={s}
        rx={0.75}
        fill={color}
      />
      <Rect
        x={offset + s + gap}
        y={offset + s + gap}
        width={s}
        height={s}
        rx={0.75}
        fill={color}
      />
    </Svg>
  );
}
