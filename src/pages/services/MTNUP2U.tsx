import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Lock, RefreshCw } from "lucide-react";

export default function MTNUP2U() {
  const balance = "5.6";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">MTN MASTER BUNDLE</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              Your Home deserves high speed internet. Enjoy fast & reliable connectivity with MTN high-speed bundles and strong network coverage.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="px-4 py-8 md:py-12">
          <div className="max-w-md mx-auto bg-card rounded-2xl shadow-lg p-6 md:p-8 border border-border">
            <div className="space-y-6">
              {/* Balance Display */}
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Available balance :</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-lg font-bold text-foreground">GH¢{balance}</span>
                </div>
              </div>

              {/* Load Wallet Button */}
              <Button 
                size="lg" 
                className="w-full h-14 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                Load a minimum amount of GH¢ 250 to proceed
              </Button>
            </div>
          </div>

          {/* Secured Footer */}
          <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Secured by Edu-Hub Data</span>
          </div>
        </div>
      </main>
    </div>
  );
}
