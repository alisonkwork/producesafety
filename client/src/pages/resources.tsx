import { LayoutShell } from "@/components/layout-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Droplets, PawPrint, Sprout, ClipboardList, UserCheck, ClipboardCheck } from "lucide-react";

const resources = [
  {
    name: "Worker Training",
    description: "Training and hygiene tasks for crews and visitors.",
    href: "/resources/training",
    icon: UserCheck,
  },
  {
    name: "Agricultural Water",
    description: "Water quality and postharvest water safety tasks.",
    href: "/resources/water",
    icon: Droplets,
  },
  {
    name: "Soil Amendments",
    description: "Biological soil amendment handling and verification tasks.",
    href: "/resources/soil",
    icon: Sprout,
  },
  {
    name: "Postharvest Handling",
    description: "Sanitation and handling tasks for harvest and packing.",
    href: "/resources/postharvest",
    icon: ClipboardList,
  },
  {
    name: "Wildlife & Animals",
    description: "Wildlife and domesticated animal risk checks.",
    href: "/resources/wildlife",
    icon: PawPrint,
  },
  {
    name: "Recordkeeping",
    description: "Self-check that required records exist (no uploads).",
    href: "/resources/recordkeeping",
    icon: ClipboardCheck,
  },
];

export default function ResourcesPage() {
  return (
    <LayoutShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Resources</h1>
          <p className="text-muted-foreground">
            Browse task checklists by category.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {resources.map((resource) => (
            <Link key={resource.href} href={resource.href}>
              <Card className="h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-sm">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                    <resource.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{resource.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {resource.description}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </LayoutShell>
  );
}
