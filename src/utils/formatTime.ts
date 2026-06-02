/** Format milliseconds as M:SS.cs or S.cs (e.g. 1:04.32, 45.20) */
export function formatTime(ms: number): string {
  const clamped = Math.max(0, ms);
  const totalSec = Math.floor(clamped / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  const centis = Math.floor((clamped % 1000) / 10);

  const ss = seconds.toString().padStart(2, "0");
  const cs = centis.toString().padStart(2, "0");

  if (minutes > 0) {
    return `${minutes}:${ss}.${cs}`;
  }
  return `${seconds}.${cs}s`;
}
