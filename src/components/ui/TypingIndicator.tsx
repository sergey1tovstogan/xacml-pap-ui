"use client";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <span className="h-2 w-2 rounded-full bg-green/60 animate-[bounce_1.4s_infinite_0ms]" />
      <span className="h-2 w-2 rounded-full bg-green/60 animate-[bounce_1.4s_infinite_200ms]" />
      <span className="h-2 w-2 rounded-full bg-green/60 animate-[bounce_1.4s_infinite_400ms]" />
    </div>
  );
}
