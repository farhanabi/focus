import { Timer } from './_components/timer';

export const runtime = 'edge';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-8 bg-black text-white">
      <Timer />
    </main>
  );
}
