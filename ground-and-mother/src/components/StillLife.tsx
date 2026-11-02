import type { Tone } from "@/content/products";

/**
 * Line-drawn still lifes for photography placeholders — kitchen objects drawn in a single
 * fine stroke, so an unshot image still reads as art-directed rather than empty.
 * They are decorative and always sit under a "Photography placeholder" label.
 */
export type Motif = "bowl" | "eggs" | "herbs" | "pot" | "loaf" | "jars" | "butter" | "cut" | "lobe" | "fish" | "fruit";

export const toneMotif: Record<Tone, Motif> = {
  broth: "bowl",
  yolk: "eggs",
  sage: "herbs",
  clay: "pot",
  linen: "loaf",
  forest: "jars",
};

const leaf = (x: number, y: number, r: number, s = 1) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s * 1.7})`}>
    <path d="M0 0 C-9 -3 -13.5 -11 -12 -18 C-4 -16.5 0 -9 0 0 Z" className="f" />
  </g>
);

const motifs: Record<Motif, React.ReactNode> = {
  bowl: (
    <>
      <path d="M86 92 C79 82 93 75 86 63" />
      <path d="M100 96 C93 83 107 74 100 57" />
      <path d="M114 92 C107 82 121 75 114 63" />
      <path d="M36 108 H164" />
      <path d="M41 108 C43 141 68 163 100 163 C132 163 157 141 159 108" className="f" />
      <path d="M80 163 C82 170 118 170 120 163" />
      <path d="M128 106 L170 52" />
      <ellipse cx="173" cy="46" rx="6.5" ry="11" transform="rotate(38 173 46)" />
      <path d="M20 176 H180" className="thin" />
    </>
  ),
  eggs: (
    <>
      <ellipse cx="74" cy="112" rx="36" ry="27" />
      <circle cx="76" cy="111" r="13" className="f2" />
      <ellipse cx="136" cy="122" rx="30" ry="22" transform="rotate(-8 136 122)" />
      <circle cx="134" cy="121" r="10.5" className="f2" />
      <path d="M44 160 C80 152 128 158 168 150" />
      <ellipse cx="38" cy="161" rx="11" ry="6.5" transform="rotate(-6 38 161)" />
      <circle cx="160" cy="76" r="1.6" className="f2" />
      <circle cx="168" cy="84" r="1.2" className="f2" />
      <circle cx="152" cy="86" r="1" className="f2" />
    </>
  ),
  herbs: (
    <>
      <path d="M100 172 C99 130 92 92 76 44" />
      <path d="M100 172 C101 128 103 86 104 36" />
      <path d="M100 172 C103 132 112 98 130 52" />
      {leaf(78, 60, 10)}{leaf(84, 82, -170, 1.1)}{leaf(89, 104, 20)}{leaf(94, 128, -165)}
      {leaf(104, 52, 0)}{leaf(104, 76, 180, 1.1)}{leaf(103, 100, 10, 1.1)}{leaf(102, 124, 175)}
      {leaf(126, 66, 30)}{leaf(120, 88, -150, 1.1)}{leaf(114, 110, 35)}
      <path d="M90 142 C96 147 106 147 112 142" />
      <path d="M90 148 C96 153 106 153 112 148" />
      <path d="M112 145 C124 150 128 160 122 166" className="thin" />
    </>
  ),
  pot: (
    <>
      <path d="M44 88 C58 66 142 66 156 88 Z" />
      <circle cx="100" cy="64" r="5.5" />
      <path d="M50 92 H150 V138 C150 152 139 162 125 162 H75 C61 162 50 152 50 138 Z" className="f" />
      <path d="M50 106 H34 M150 106 H166" />
      <path d="M62 120 H138" className="thin" />
      <path d="M80 54 C76 46 84 42 80 34 M120 54 C116 46 124 42 120 34" className="thin" />
      <path d="M22 172 H178" className="thin" />
    </>
  ),
  loaf: (
    <>
      <path d="M36 140 C34 102 64 82 100 82 C136 82 166 102 164 140 Z" className="f" />
      <path d="M68 104 C72 112 74 120 74 130" />
      <path d="M96 96 C100 106 102 116 101 128" />
      <path d="M124 100 C127 110 128 120 127 130" />
      <path d="M18 150 H182" />
      <path d="M28 158 L172 158 M40 166 L160 166" className="thin" />
      <path d="M150 150 C158 132 176 128 186 140" className="thin" />
    </>
  ),
  jars: (
    <>
      <rect x="40" y="70" width="48" height="11" rx="2" />
      <path d="M44 81 H84 V152 C84 159 79 164 72 164 H56 C49 164 44 159 44 152 Z" className="f" />
      <path d="M50 120 H78 M50 128 H72" className="thin" />
      <rect x="104" y="48" width="56" height="12" rx="2" />
      <path d="M108 60 H156 V152 C156 159 151 164 144 164 H120 C113 164 108 159 108 152 Z" />
      <circle cx="122" cy="132" r="5" className="f2" /><circle cx="138" cy="140" r="5" className="f2" /><circle cx="128" cy="148" r="5" className="f2" /><circle cx="144" cy="124" r="5" className="f2" /><circle cx="120" cy="116" r="5" className="f2" />
      <path d="M24 164 H176" />
    </>
  ),
  butter: (
    <>
      <path d="M30 140 L60 112 H176 L150 140 Z" className="thin" />
      <path d="M62 96 H150 V128 H62 Z" className="f" />
      <path d="M62 96 L80 84 H166 L150 96" />
      <path d="M150 96 L166 84 V116 L150 128" />
      <path d="M96 96 C104 90 116 90 124 96" className="thin" />
      <path d="M44 156 L118 150 M118 150 L170 147" />
      <path d="M118 147 V153" className="thin" />
    </>
  ),
  cut: (
    <>
      <path d="M48 112 C46 82 86 66 120 72 C156 78 170 104 160 126 C150 148 112 160 82 152 C60 146 50 132 48 112 Z" className="f" />
      <path d="M70 108 C88 96 112 96 130 104 M76 126 C96 118 120 120 140 126 M98 84 C104 96 104 140 96 150" className="thin" />
      <circle cx="118" cy="114" r="9" />
      <path d="M24 170 H176" className="thin" />
    </>
  ),
  lobe: (
    <>
      <path d="M44 120 C40 92 70 76 100 84 C116 70 150 72 160 96 C170 120 148 148 118 150 C96 152 82 140 70 144 C56 148 46 136 44 120 Z" className="f" />
      <path d="M100 84 C102 104 108 126 118 150" className="thin" />
      <path d="M140 60 C150 50 166 52 170 64 C160 70 150 68 140 60 Z M140 60 L128 78" className="thin" />
      <path d="M22 170 C70 162 130 166 180 160" className="thin" />
    </>
  ),
  fish: (
    <>
      <path d="M36 104 C64 76 120 74 150 100 C120 128 64 128 36 104 Z" className="f" />
      <path d="M150 100 L178 82 L172 100 L178 118 Z" />
      <circle cx="58" cy="100" r="3" className="f2" />
      <path d="M74 92 C78 100 78 108 74 114" className="thin" />
      <path d="M90 90 C110 96 128 96 140 100 M92 112 C110 108 128 106 140 102" className="thin" />
      <path d="M30 150 C70 144 130 146 172 140" className="thin" />
    </>
  ),
  fruit: (
    <>
      <path d="M70 92 C46 92 40 120 48 138 C56 156 80 162 96 150 C112 162 134 154 140 136 C148 116 138 92 112 94 C104 96 100 100 96 104 C92 98 82 92 70 92 Z" className="f" />
      <path d="M96 104 C96 92 100 80 108 72" />
      <path d="M108 72 C118 62 136 64 140 74 C128 82 116 80 108 72 Z" className="thin" />
      <circle cx="146" cy="150" r="16" />
      <path d="M146 134 C148 128 152 124 156 122" className="thin" />
      <path d="M24 172 H176" className="thin" />
    </>
  ),
};

export function StillLife({ motif, className }: { motif: Motif; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {motifs[motif]}
    </svg>
  );
}
