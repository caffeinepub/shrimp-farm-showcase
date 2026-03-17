import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Farm, FarmPhoto, FarmerProfile } from "../backend";
import { useActor } from "./useActor";

export function useFarmerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<FarmerProfile | null>({
    queryKey: ["farmerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFarmerProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllFarms() {
  const { actor, isFetching } = useActor();
  return useQuery<Farm[]>({
    queryKey: ["farms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFarms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFarmPhotos(farmId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<FarmPhoto[]>({
    queryKey: ["farmPhotos", farmId],
    queryFn: async () => {
      if (!actor || !farmId) return [];
      return actor.getPhotosByFarmId(farmId);
    },
    enabled: !!actor && !isFetching && !!farmId,
  });
}

export function useUpdateFarmerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: FarmerProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateFarmerProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmerProfile"] });
    },
  });
}

export function useCreateFarm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farm: Farm) => {
      if (!actor) throw new Error("Not connected");
      return actor.createFarm(farm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
    },
  });
}

export function useUpdateFarm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farm: Farm) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateFarm(farm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
    },
  });
}

export function useDeleteFarm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (farmId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteFarm(farmId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
    },
  });
}

export function useAddFarmPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photo: FarmPhoto) => {
      if (!actor) throw new Error("Not connected");
      return actor.addFarmPhoto(photo);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["farmPhotos", variables.farmId],
      });
    },
  });
}

export function useDeleteFarmPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      photoId,
      farmId: _farmId,
    }: { photoId: string; farmId: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteFarmPhoto(photoId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["farmPhotos", variables.farmId],
      });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        // Use safeIsCallerAdmin which never traps for unregistered users
        return await (actor as any).safeIsCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClaimAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<boolean> => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).claimAdmin();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}
