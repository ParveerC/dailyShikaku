interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="help-title" className="text-xl font-bold text-card-foreground">
            How to play Shikaku
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
            aria-label="Close help"
          >
            ✕
          </button>
        </div>

        <ol className="space-y-4 text-sm text-card-foreground">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
            <p>The grid contains numbered clues. Each number tells you the <span className="font-semibold">area</span> of the rectangle that must contain it.</p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
            <p><span className="font-semibold">Click and drag</span> across the grid to draw a rectangle. The rectangle's width × height must equal the clue inside it.</p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
            <p>Every rectangle must contain <span className="font-semibold">exactly one clue</span>. Rectangles cannot overlap.</p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">4</span>
            <p>The puzzle is solved when the <span className="font-semibold">entire grid</span> is covered with valid rectangles and every clue is used.</p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">5</span>
            <p><span className="font-semibold">Click a placed rectangle</span> to remove it if you want to redo it.</p>
          </li>
        </ol>

        <div className="mt-6 rounded-lg bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Example:</span> A clue showing <span className="font-semibold">6</span> could be covered by a 2×3, 3×2, 1×6, or 6×1 rectangle — as long as it fits in the grid.
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Got it
        </button>
      </div>
    </div>
  );
}