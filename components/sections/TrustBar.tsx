import { MapPin, Landmark, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { site, yearsInBusiness } from "@/lib/site";

export function TrustBar() {
  const items = [
    {
      icon: ShieldCheck,
      text: `Locally owned since ${site.foundedYear} — ${yearsInBusiness()} years`,
    },
    { icon: MapPin, text: "Based in Russell Springs, Kentucky" },
    { icon: Landmark, text: "Serving local government, business & homes" },
  ];
  return (
    <div className="border-y border-cream-200 bg-cream-100">
      <Container>
        <ul className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          {items.map((item) => (
            <li key={item.text} className="flex items-center gap-2.5 text-sm font-medium text-ink-700">
              <item.icon className="h-4.5 w-4.5 shrink-0 text-navy-600" aria-hidden="true" />
              {item.text}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
