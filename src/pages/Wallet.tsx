import { Sidebar } from "@/components/Sidebar";

export default function Wallet() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Wallet</h1>
        <p className="text-muted-foreground">Wallet page coming soon...</p>
      </main>
    </div>
  );
}
