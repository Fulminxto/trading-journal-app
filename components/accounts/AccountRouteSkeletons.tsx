import Card from "@/components/ui/Card";

function Block({ className }: { className: string }) {
  return <div className={`rounded-inner bg-flash/[0.08] ${className}`} />;
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div aria-hidden="true" role="presentation" className="animate-pulse space-y-8 motion-reduce:animate-none">{children}</div>;
}

export function AccountLibrarySkeleton() {
  return <Frame><Card variant="hero" className="p-8"><Block className="h-3 w-28" /><Block className="mt-4 h-9 w-2/3 max-w-lg" /><Block className="mt-4 h-4 w-full max-w-xl" /><Block className="mt-6 h-9 w-52 rounded-pill" /></Card><div className="flex flex-col gap-4 lg:flex-row lg:justify-between"><Block className="h-11 w-full lg:max-w-md" /><div className="flex gap-3"><Block className="h-11 w-32" /><Block className="h-11 w-24" /></div></div><div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Card key={index} className="min-h-80"><Block className="h-5 w-2/3" /><Block className="mt-4 h-8 w-1/2" /><Block className="mt-6 h-20 w-full" /><div className="mt-6 grid grid-cols-2 gap-4"><Block className="h-12 w-full" /><Block className="h-12 w-full" /><Block className="h-12 w-full" /><Block className="h-12 w-full" /></div></Card>)}</div></Frame>;
}

export function CreateAccountSkeleton() {
  return <Frame><div><Block className="h-4 w-24" /><Block className="mt-3 h-9 w-72 max-w-full" /><Block className="mt-4 h-4 w-full max-w-xl" /></div><Card className="max-w-4xl"><div className="grid grid-cols-1 gap-5 md:grid-cols-2">{Array.from({ length: 8 }, (_, index) => <div key={index}><Block className="mb-2 h-3 w-24" /><Block className="h-12 w-full" /></div>)}</div><div className="mt-6 flex justify-end gap-3"><Block className="h-11 w-24" /><Block className="h-11 w-40" /></div></Card></Frame>;
}

export function ManageAccountsSkeleton() {
  return <Frame><div><Block className="h-4 w-28" /><Block className="mt-3 h-9 w-80 max-w-full" /><Block className="mt-4 h-4 w-full max-w-2xl" /></div><div className="grid grid-cols-1 gap-4 md:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Card key={index}><Block className="h-4 w-28" /><Block className="mt-3 h-8 w-20" /></Card>)}</div>{Array.from({ length: 2 }, (_, index) => <Card key={index} className="min-h-48"><Block className="h-6 w-1/3" /><Block className="mt-5 h-14 w-full" /><Block className="mt-4 h-11 w-32" /></Card>)}</Frame>;
}

export function ArchivedAccountsSkeleton() {
  return <Frame><div><Block className="h-3 w-28" /><Block className="mt-3 h-8 w-64" /><Block className="mt-4 h-4 w-full max-w-xl" /></div><div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Card key={index} className="min-h-64"><Block className="h-6 w-2/3" /><div className="mt-6 grid grid-cols-2 gap-4"><Block className="h-12 w-full" /><Block className="h-12 w-full" /><Block className="h-12 w-full" /><Block className="h-12 w-full" /></div><Block className="mt-6 h-11 w-full" /></Card>)}</div></Frame>;
}
