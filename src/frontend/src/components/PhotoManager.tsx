import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { FarmPhoto } from "../backend";
import { useBlobUrl } from "../hooks/useBlobUrl";
import {
  useAddFarmPhoto,
  useDeleteFarmPhoto,
  useFarmPhotos,
} from "../hooks/useQueries";

function PhotoThumb({
  photo,
  onDelete,
}: { photo: FarmPhoto; onDelete: () => void }) {
  const url = useBlobUrl(photo.blobId);
  return (
    <div className="relative group rounded-lg overflow-hidden bg-muted border border-border">
      {url ? (
        <img
          src={url}
          alt={photo.caption || "Farm photo"}
          className="w-full h-28 object-cover"
        />
      ) : (
        <div className="w-full h-28 flex items-center justify-center bg-muted">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button
          variant="destructive"
          size="icon"
          className="w-8 h-8"
          onClick={onDelete}
          data-ocid="photo.delete_button"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      {photo.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
          {photo.caption}
        </div>
      )}
    </div>
  );
}

interface Props {
  farmId: string;
}

export default function PhotoManager({ farmId }: Props) {
  const { data: photos, isLoading } = useFarmPhotos(farmId);
  const addPhoto = useAddFarmPhoto();
  const deletePhoto = useDeleteFarmPhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());

      const { loadConfig } = await import("../config");
      const { StorageClient } = await import("../utils/StorageClient");
      const { HttpAgent } = await import("@icp-sdk/core/agent");

      const config = await loadConfig();
      const agent = new HttpAgent({ host: config.backend_host });
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );

      const { hash } = await storageClient.putFile(bytes, (p) =>
        setUploadProgress(p),
      );
      const SENTINEL = "!caf!";
      const blobId = new TextEncoder().encode(SENTINEL + hash);

      const photo: FarmPhoto = {
        id: crypto.randomUUID(),
        farmId,
        blobId,
        caption: caption.trim(),
        order: BigInt(photos?.length ?? 0),
      };

      await addPhoto.mutateAsync(photo);
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Photo uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload photo");
      console.error(err);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        className="border-2 border-dashed border-border rounded-xl p-4 text-center"
        data-ocid="photo.dropzone"
      >
        <div className="flex flex-col items-center gap-2 mb-3">
          <Upload className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Upload a farm photo
          </span>
        </div>
        <Input
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mb-2"
          data-ocid="photo.input"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          data-ocid="photo.upload_button"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading {uploadProgress}%
            </>
          ) : (
            <>Select Photo</>
          )}
        </Button>
      </div>

      {/* Photos grid */}
      {isLoading ? (
        <div
          className="text-sm text-muted-foreground"
          data-ocid="photo.loading_state"
        >
          Loading photos...
        </div>
      ) : photos && photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <PhotoThumb
              key={photo.id}
              photo={photo}
              onDelete={() => deletePhoto.mutate({ photoId: photo.id, farmId })}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-sm text-muted-foreground text-center py-4"
          data-ocid="photo.empty_state"
        >
          No photos yet. Upload some to showcase this farm.
        </div>
      )}
    </div>
  );
}
