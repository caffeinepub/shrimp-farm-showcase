import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import type { Farm } from "../backend";

interface Props {
  initial?: Partial<Farm>;
  onSubmit: (farm: Farm) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function FarmForm({
  initial,
  onSubmit,
  onCancel,
  isLoading,
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [acreage, setAcreage] = useState(initial?.acreage?.toString() ?? "");
  const [pondCount, setPondCount] = useState(
    initial?.pondCount?.toString() ?? "",
  );
  const [species, setSpecies] = useState(initial?.species ?? "");
  const [capacity, setCapacity] = useState(
    initial?.productionCapacity?.toString() ?? "",
  );
  const [certInput, setCertInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>(
    initial?.certifications ?? [],
  );

  const addCert = () => {
    const trimmed = certInput.trim();
    if (trimmed && !certifications.includes(trimmed)) {
      setCertifications((prev) => [...prev, trimmed]);
      setCertInput("");
    }
  };

  const removeCert = (cert: string) => {
    setCertifications((prev) => prev.filter((c) => c !== cert));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const farm: Farm = {
      id: initial?.id ?? crypto.randomUUID(),
      created: initial?.created ?? BigInt(Date.now()),
      name,
      description,
      acreage: Number.parseFloat(acreage) || 0,
      pondCount: BigInt(Number.parseInt(pondCount) || 0),
      species,
      productionCapacity: Number.parseFloat(capacity) || 0,
      certifications,
    };
    onSubmit(farm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="farm-name">Farm Name *</Label>
          <Input
            id="farm-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Godavari Aqua Farm - Unit 1"
            required
            data-ocid="farm.input"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="farm-desc">Description</Label>
          <Textarea
            id="farm-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the farm..."
            rows={3}
            data-ocid="farm.textarea"
          />
        </div>
        <div>
          <Label htmlFor="farm-acreage">Acreage (acres) *</Label>
          <Input
            id="farm-acreage"
            type="number"
            step="0.1"
            value={acreage}
            onChange={(e) => setAcreage(e.target.value)}
            placeholder="40"
            required
            data-ocid="farm.input"
          />
        </div>
        <div>
          <Label htmlFor="farm-ponds">Number of Ponds</Label>
          <Input
            id="farm-ponds"
            type="number"
            value={pondCount}
            onChange={(e) => setPondCount(e.target.value)}
            placeholder="24"
            data-ocid="farm.input"
          />
        </div>
        <div>
          <Label htmlFor="farm-species">Species</Label>
          <Input
            id="farm-species"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="Litopenaeus vannamei"
            data-ocid="farm.input"
          />
        </div>
        <div>
          <Label htmlFor="farm-capacity">Production Capacity (MT/yr)</Label>
          <Input
            id="farm-capacity"
            type="number"
            step="0.1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="120"
            data-ocid="farm.input"
          />
        </div>
        <div className="md:col-span-2">
          <Label>Certifications</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              placeholder="e.g. BMP Certified"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCert();
                }
              }}
              data-ocid="farm.input"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addCert}
              data-ocid="farm.secondary_button"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {certifications.map((cert) => (
              <span
                key={cert}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                {cert}
                <button
                  type="button"
                  onClick={() => removeCert(cert)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          data-ocid="farm.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-primary text-primary-foreground"
          disabled={isLoading}
          data-ocid="farm.submit_button"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isLoading
            ? "Saving..."
            : initial?.id
              ? "Update Farm"
              : "Create Farm"}
        </Button>
      </div>
    </form>
  );
}
