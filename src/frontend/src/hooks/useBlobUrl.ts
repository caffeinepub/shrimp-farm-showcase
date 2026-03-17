import { HttpAgent } from "@icp-sdk/core/agent";
import { useEffect, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

const SENTINEL = "!caf!";

export function blobIdToHash(blobId: Uint8Array): string | null {
  try {
    const decoded = new TextDecoder().decode(blobId);
    if (!decoded.startsWith(SENTINEL)) return null;
    return decoded.substring(SENTINEL.length);
  } catch {
    return null;
  }
}

let storageClientCache: StorageClient | null = null;

async function getStorageClient(): Promise<StorageClient> {
  if (storageClientCache) return storageClientCache;
  const config = await loadConfig();
  const agent = new HttpAgent({ host: config.backend_host });
  storageClientCache = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
  return storageClientCache;
}

export function useBlobUrl(
  blobId: Uint8Array | null | undefined,
): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blobId || blobId.length === 0) {
      setUrl(null);
      return;
    }
    const hash = blobIdToHash(blobId);
    if (!hash) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    getStorageClient()
      .then((client) => {
        return client.getDirectURL(hash);
      })
      .then((directUrl) => {
        if (!cancelled) setUrl(directUrl);
      })
      .catch(() => {
        if (!cancelled) setUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [blobId]);

  return url;
}
