import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Fish,
  Image,
  LayoutDashboard,
  Loader2,
  LogOut,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Farm, FarmerProfile } from "../backend";
import FarmForm from "../components/FarmForm";
import PhotoManager from "../components/PhotoManager";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllFarms,
  useClaimAdmin,
  useCreateFarm,
  useDeleteFarm,
  useFarmerProfile,
  useIsAdmin,
  useUpdateFarm,
  useUpdateFarmerProfile,
} from "../hooks/useQueries";

export default function AdminPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const claimAdmin = useClaimAdmin();

  const { data: profile, isLoading: profileLoading } = useFarmerProfile();
  const { data: farms, isLoading: farmsLoading } = useAllFarms();

  const updateProfile = useUpdateFarmerProfile();
  const createFarm = useCreateFarm();
  const updateFarm = useUpdateFarm();
  const deleteFarm = useDeleteFarm();

  const [createFarmOpen, setCreateFarmOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [deletingFarmId, setDeletingFarmId] = useState<string | null>(null);
  const [expandedFarmId, setExpandedFarmId] = useState<string | null>(null);

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<FarmerProfile>({
    name: "",
    about: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
  });

  const openEditProfile = () => {
    if (profile) setProfileForm(profile);
    setEditProfileOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync(profileForm);
      toast.success("Profile updated");
      setEditProfileOpen(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleCreateFarm = async (farm: Farm) => {
    try {
      await createFarm.mutateAsync(farm);
      toast.success("Farm created");
      setCreateFarmOpen(false);
    } catch {
      toast.error("Failed to create farm");
    }
  };

  const handleUpdateFarm = async (farm: Farm) => {
    try {
      await updateFarm.mutateAsync(farm);
      toast.success("Farm updated");
      setEditingFarm(null);
    } catch {
      toast.error("Failed to update farm");
    }
  };

  const handleDeleteFarm = async () => {
    if (!deletingFarmId) return;
    try {
      await deleteFarm.mutateAsync(deletingFarmId);
      toast.success("Farm deleted");
      setDeletingFarmId(null);
    } catch {
      toast.error("Failed to delete farm");
    }
  };

  const handleClaimAdmin = async () => {
    try {
      const result = await claimAdmin.mutateAsync();
      if (result === true) {
        toast.success("Admin access granted");
      } else {
        toast.error("Admin access already claimed by another account.");
      }
    } catch {
      toast.error("Failed to claim admin access");
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2
          className="w-8 h-8 animate-spin text-primary"
          data-ocid="admin.loading_state"
        />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.08 210) 0%, oklch(0.38 0.12 195) 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-hero p-8 max-w-sm w-full mx-4"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Fish className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Admin Portal
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Godavari Aqua Farms Management
            </p>
          </div>
          <Button
            className="w-full bg-primary text-primary-foreground"
            size="lg"
            onClick={login}
            disabled={loginStatus === "logging-in"}
            data-ocid="admin.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...
              </>
            ) : (
              "Login to Admin Panel"
            )}
          </Button>
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← Back to public site
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2
          className="w-8 h-8 animate-spin text-primary"
          data-ocid="admin.loading_state"
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.08 210) 0%, oklch(0.38 0.12 195) 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-hero p-8 max-w-sm w-full mx-4"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Set Up Admin Access
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Your account is not yet registered as admin. Click below to claim
              admin access for this app.
            </p>
          </div>
          <Button
            className="w-full bg-primary text-primary-foreground"
            size="lg"
            onClick={handleClaimAdmin}
            disabled={claimAdmin.isPending}
            data-ocid="admin.primary_button"
          >
            {claimAdmin.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Claiming...
              </>
            ) : (
              "Claim Admin Access"
            )}
          </Button>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={clear}
              className="text-sm text-muted-foreground hover:text-primary"
              data-ocid="admin.secondary_button"
            >
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">
              Farm Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block">
              {identity?.getPrincipal().toString().slice(0, 16)}...
            </span>
            <Link to="/">
              <Button variant="ghost" size="sm" data-ocid="admin.link">
                View Site
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={clear}
              data-ocid="admin.secondary_button"
            >
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Farmer Profile</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={openEditProfile}
              data-ocid="profile.edit_button"
            >
              <Edit2 className="w-4 h-4 mr-1" /> Edit Profile
            </Button>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <div className="space-y-2" data-ocid="profile.loading_state">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-64" />
              </div>
            ) : profile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  <span className="font-medium ml-1">{profile.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  <span className="font-medium ml-1">{profile.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  <span className="font-medium ml-1">
                    {profile.contactPhone}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <span className="font-medium ml-1">
                    {profile.contactEmail}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">About:</span>{" "}
                  <span className="ml-1">{profile.about}</span>
                </div>
              </div>
            ) : (
              <p
                className="text-muted-foreground text-sm"
                data-ocid="profile.empty_state"
              >
                No profile set. Click Edit Profile to add your details.
              </p>
            )}
          </CardContent>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              Farm Management
            </h2>
            <Dialog open={createFarmOpen} onOpenChange={setCreateFarmOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary text-primary-foreground"
                  data-ocid="farms.open_modal_button"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Farm
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl" data-ocid="farms.dialog">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    Create New Farm
                  </DialogTitle>
                </DialogHeader>
                <FarmForm
                  onSubmit={handleCreateFarm}
                  onCancel={() => setCreateFarmOpen(false)}
                  isLoading={createFarm.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>

          {farmsLoading ? (
            <div className="space-y-3" data-ocid="farms.loading_state">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : farms && farms.length > 0 ? (
            <div className="space-y-3">
              {farms.map((farm, idx) => (
                <Card key={farm.id} data-ocid={`farms.item.${idx + 1}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">
                            {farm.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {farm.acreage} acres
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {farm.pondCount.toString()} ponds
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
                          {farm.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setExpandedFarmId(
                              expandedFarmId === farm.id ? null : farm.id,
                            )
                          }
                          data-ocid="farms.toggle"
                        >
                          {expandedFarmId === farm.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingFarm(farm)}
                          data-ocid="farms.edit_button"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingFarmId(farm.id)}
                          data-ocid="farms.delete_button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {expandedFarmId === farm.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <Separator className="mb-4" />
                        <div className="flex items-center gap-2 mb-3">
                          <Image className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">
                            Photo Gallery
                          </span>
                        </div>
                        <PhotoManager farmId={farm.id} />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="farms.empty_state"
            >
              <Fish className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No farms added yet. Click "Add Farm" to get started.</p>
            </div>
          )}
        </div>
      </main>

      <Dialog
        open={!!editingFarm}
        onOpenChange={(open) => {
          if (!open) setEditingFarm(null);
        }}
      >
        <DialogContent className="max-w-xl" data-ocid="farms.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Farm</DialogTitle>
          </DialogHeader>
          {editingFarm && (
            <FarmForm
              initial={editingFarm}
              onSubmit={handleUpdateFarm}
              onCancel={() => setEditingFarm(null)}
              isLoading={updateFarm.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent data-ocid="profile.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Edit Farmer Profile
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <Label htmlFor="p-name">Name</Label>
              <Input
                id="p-name"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, name: e.target.value }))
                }
                data-ocid="profile.input"
              />
            </div>
            <div>
              <Label htmlFor="p-location">Location</Label>
              <Input
                id="p-location"
                value={profileForm.location}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, location: e.target.value }))
                }
                data-ocid="profile.input"
              />
            </div>
            <div>
              <Label htmlFor="p-phone">Phone</Label>
              <Input
                id="p-phone"
                value={profileForm.contactPhone}
                onChange={(e) =>
                  setProfileForm((p) => ({
                    ...p,
                    contactPhone: e.target.value,
                  }))
                }
                data-ocid="profile.input"
              />
            </div>
            <div>
              <Label htmlFor="p-email">Email</Label>
              <Input
                id="p-email"
                type="email"
                value={profileForm.contactEmail}
                onChange={(e) =>
                  setProfileForm((p) => ({
                    ...p,
                    contactEmail: e.target.value,
                  }))
                }
                data-ocid="profile.input"
              />
            </div>
            <div>
              <Label htmlFor="p-about">About</Label>
              <Textarea
                id="p-about"
                rows={3}
                value={profileForm.about}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, about: e.target.value }))
                }
                data-ocid="profile.textarea"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setEditProfileOpen(false)}
                data-ocid="profile.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground"
                disabled={updateProfile.isPending}
                data-ocid="profile.submit_button"
              >
                {updateProfile.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Save Profile
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingFarmId}
        onOpenChange={(open) => {
          if (!open) setDeletingFarmId(null);
        }}
      >
        <AlertDialogContent data-ocid="farms.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Farm</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will permanently delete this farm and all its
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="farms.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFarm}
              className="bg-destructive text-destructive-foreground"
              data-ocid="farms.confirm_button"
            >
              Delete Farm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
