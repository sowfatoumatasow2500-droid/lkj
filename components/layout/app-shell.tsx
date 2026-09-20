"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TriangleAlert as AlertTriangle, RotateCcw } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { loading, session, signingOut, authError, refresh } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
  };

  if (authError && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="p-8 max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Problème de chargement
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{authError}</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => refresh()}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                window.location.href = "/auth/login?t=" + Date.now();
              }}
            >
              Reconnexion
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading || signingOut) {
    return <LoadingState message={signingOut ? "Déconnexion..." : "Chargement de votre espace..."} />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
