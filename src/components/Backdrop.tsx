export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-50">
      <div className="animate-float absolute -left-24 -top-24 size-112 rounded-full bg-brand-300/40 blur-3xl" />
      <div className="animate-float absolute -right-32 top-1/3 size-120 rounded-full bg-rose-300/30 blur-3xl [animation-delay:-4s]" />
      <div className="animate-float absolute -bottom-40 left-1/4 size-104 rounded-full bg-amber-200/40 blur-3xl [animation-delay:-7s]" />
    </div>
  );
}
