// components/LoadingScreen.tsx
export function LoadingScreen({ message = 'جاري التحميل...' }: { message?: string }) {
  return (
    <div className="flex flex-1 min-h-screen items-center justify-center gap-4 flex-col bg-background">
      <div
        className="w-9 h-9 rounded-full border-[3px] border-border border-t-bronze animate-spin"
        role="status"
        aria-label={message}
      />
      <p className="text-sm text-muted-foreground text-center">{message}</p>
    </div>
  );
}
