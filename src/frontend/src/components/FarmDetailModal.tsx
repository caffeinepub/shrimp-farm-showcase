import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Fish,
  MapPin,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Farm, FarmPhoto } from "../backend";
import { useBlobUrl } from "../hooks/useBlobUrl";
import { useFarmPhotos } from "../hooks/useQueries";

const CERT_COLORS: Record<string, string> = {
  "BMP Certified": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "MPEDA Registered": "bg-blue-100 text-blue-800 border-blue-200",
  "EIC Approved": "bg-purple-100 text-purple-800 border-purple-200",
  "BAP 4-Star": "bg-amber-100 text-amber-800 border-amber-200",
  "ASC Certified": "bg-teal-100 text-teal-800 border-teal-200",
  HACCP: "bg-orange-100 text-orange-800 border-orange-200",
};

function PhotoItem({
  photo,
  isActive,
}: { photo: FarmPhoto; isActive: boolean }) {
  const url = useBlobUrl(photo.blobId);
  if (!isActive) return null;
  return (
    <div className="relative w-full h-72 bg-muted rounded-lg overflow-hidden">
      {url ? (
        <img
          src={url}
          alt={photo.caption || "Farm photo"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <img
            src="/assets/generated/farm-pond-1.dim_800x600.jpg"
            alt="Farm"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {photo.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm px-3 py-2">
          {photo.caption}
        </div>
      )}
    </div>
  );
}

interface Props {
  farm: Farm;
  onClose: () => void;
}

export default function FarmDetailModal({ farm, onClose }: Props) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const { data: photos, isLoading: photosLoading } = useFarmPhotos(farm.id);

  const allPhotos = photos && photos.length > 0 ? photos : null;

  const prevPhoto = () => setPhotoIdx((i) => Math.max(0, i - 1));
  const nextPhoto = () =>
    setPhotoIdx((i) => Math.min((allPhotos?.length ?? 1) - 1, i + 1));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        data-ocid="farm.modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl shadow-hero max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <h2 className="font-display font-bold text-xl text-foreground">
              {farm.name}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-ocid="farm.close_button"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Photo Gallery */}
            <div>
              {photosLoading ? (
                <Skeleton className="h-72 w-full rounded-lg" />
              ) : allPhotos ? (
                <div className="relative">
                  {allPhotos.map((photo, idx) => (
                    <PhotoItem
                      key={photo.id}
                      photo={photo}
                      isActive={idx === photoIdx}
                    />
                  ))}
                  {allPhotos.length > 1 && (
                    <div className="flex items-center justify-between mt-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevPhoto}
                        disabled={photoIdx === 0}
                        data-ocid="farm.pagination_prev"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {photoIdx + 1} / {allPhotos.length}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextPhoto}
                        disabled={photoIdx === allPhotos.length - 1}
                        data-ocid="farm.pagination_next"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-72 rounded-lg overflow-hidden">
                  <img
                    src="/assets/generated/farm-harvest.dim_800x600.jpg"
                    alt={farm.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {farm.description}
            </p>

            {/* Farm Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: MapPin,
                  label: "Total Acreage",
                  value: `${farm.acreage} acres`,
                },
                {
                  icon: Droplets,
                  label: "Pond Count",
                  value: `${farm.pondCount.toString()} ponds`,
                },
                { icon: Fish, label: "Primary Species", value: farm.species },
                {
                  icon: BarChart3,
                  label: "Production Capacity",
                  value: `${farm.productionCapacity} MT/year`,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      {label}
                    </span>
                  </div>
                  <div className="font-semibold text-foreground">{value}</div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            {farm.certifications.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">
                    Certifications & Registrations
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {farm.certifications.map((cert) => (
                    <span
                      key={cert}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${CERT_COLORS[cert] || "bg-gray-100 text-gray-800 border-gray-200"}`}
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
