import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, ChevronRight, Droplets, Fish, MapPin } from "lucide-react";
import { motion } from "motion/react";
import type { Farm } from "../backend";

const CERT_COLORS: Record<string, string> = {
  "BMP Certified": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "MPEDA Registered": "bg-blue-100 text-blue-800 border-blue-200",
  "EIC Approved": "bg-purple-100 text-purple-800 border-purple-200",
  "BAP 4-Star": "bg-amber-100 text-amber-800 border-amber-200",
  "ASC Certified": "bg-teal-100 text-teal-800 border-teal-200",
  HACCP: "bg-orange-100 text-orange-800 border-orange-200",
};

function getCertColor(cert: string): string {
  return CERT_COLORS[cert] || "bg-gray-100 text-gray-800 border-gray-200";
}

interface Props {
  farm: Farm;
  onClick: () => void;
}

export default function FarmCard({ farm, onClick }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Header image placeholder */}
      <div
        className="h-48 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.10 195) 0%, oklch(0.50 0.13 185) 100%)",
        }}
      >
        <img
          src="/assets/generated/farm-pond-1.dim_800x600.jpg"
          alt={farm.name}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-bold text-white text-lg leading-tight">
            {farm.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {farm.description}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Acreage</div>
              <div className="font-semibold text-sm text-foreground">
                {farm.acreage} acres
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Ponds</div>
              <div className="font-semibold text-sm text-foreground">
                {farm.pondCount.toString()} ponds
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Fish className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Species</div>
              <div className="font-semibold text-sm text-foreground truncate">
                {farm.species.split("(")[0].trim()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Capacity</div>
              <div className="font-semibold text-sm text-foreground">
                {farm.productionCapacity} MT/yr
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        {farm.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {farm.certifications.map((cert) => (
              <span
                key={cert}
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getCertColor(cert)}`}
              >
                {cert}
              </span>
            ))}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-primary hover:text-primary hover:bg-primary/5"
        >
          View Details <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
