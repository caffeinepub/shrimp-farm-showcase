import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  type FarmerProfile = {
    name : Text;
    location : Text;
    contactPhone : Text;
    contactEmail : Text;
    about : Text;
  };

  type Farm = {
    id : Text;
    name : Text;
    description : Text;
    acreage : Float;
    pondCount : Nat;
    species : Text;
    productionCapacity : Float;
    certifications : [Text];
    created : Int;
  };

  type FarmPhoto = {
    id : Text;
    farmId : Text;
    blobId : Blob;
    caption : Text;
    order : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  var farmerProfile : ?FarmerProfile = ?{
    name = "Hemanth Mukku";
    location = "West Godavari, Andhra Pradesh, India";
    contactPhone = "+91 9398886020";
    contactEmail = "hemanthmukku3@gmail.com";
    about = "Third-generation shrimp farmer with over 20 years of experience in sustainable aquaculture. Our farms in West Godavari are known for premium quality Vannamei shrimp raised using best aquaculture practices. We supply to major seafood processing companies across Andhra Pradesh and beyond.";
  };

  let farms = Map.empty<Text, Farm>();
  let farmPhotos = Map.empty<Text, FarmPhoto>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Safe admin check that does not trap for unregistered users
  func safeIsAdmin(caller : Principal) : Bool {
    if (caller.isAnonymous()) return false;
    switch (accessControlState.userRoles.get(caller)) {
      case (? #admin) true;
      case (_) false;
    };
  };

  module Farm {
    public func compareByTimestamp(farm1 : Farm, farm2 : Farm) : Order.Order {
      Int.compare(farm1.created, farm2.created);
    };
  };

  // Seed default farms if none exist
  func seedFarmsIfEmpty() {
    if (farms.size() == 0) {
      let sampleFarms = [
        {
          id = "farm1";
          name = "Godavari Aqua Farm - Unit 1";
          description = "Flagship 5-acre facility with scientifically designed rectangular ponds. Equipped with automated aeration, water quality monitoring, and biosecurity protocols.";
          acreage = 5.0;
          pondCount = 3;
          species = "Litopenaeus vannamei (Vannamei)";
          productionCapacity = 30.0;
          certifications = ["BMP Certified", "MPEDA Registered", "EIC Approved"];
          created = Time.now();
        },
        {
          id = "farm2";
          name = "Delta Shrimp Farm - Unit 2";
          description = "Semi-intensive 5-acre farm utilizing natural tidal water exchange with modern paddlewheel aerators. Focus on organic and antibiotic-free shrimp production.";
          acreage = 5.0;
          pondCount = 3;
          species = "Litopenaeus vannamei (Vannamei)";
          productionCapacity = 25.0;
          certifications = ["BAP 4-Star", "MPEDA Registered"];
          created = Time.now();
        },
        {
          id = "farm3";
          name = "Kolleru Aquaculture Park";
          description = "5-acre aquaculture park with integrated mangrove buffer zones. Premium export-grade shrimp with full chain of custody documentation.";
          acreage = 5.0;
          pondCount = 3;
          species = "Penaeus monodon (Tiger Shrimp)";
          productionCapacity = 28.0;
          certifications = ["ASC Certified", "BMP Certified", "HACCP", "MPEDA Registered"];
          created = Time.now();
        },
      ];
      for (farm in sampleFarms.values()) {
        farms.add(farm.id, farm);
      };
    };
  };

  // Run seeding on initialization and after upgrades
  seedFarmsIfEmpty();

  // Bootstrap: claim admin if none assigned yet
  public shared ({ caller }) func claimAdmin() : async Bool {
    if (accessControlState.adminAssigned) return false;
    if (caller.isAnonymous()) return false;
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    true;
  };

  // Safe version of isCallerAdmin that never traps
  public query ({ caller }) func safeIsCallerAdmin() : async Bool {
    safeIsAdmin(caller);
  };

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not safeIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Farmer profile functions
  public shared ({ caller }) func updateFarmerProfile(profile : FarmerProfile) : async () {
    if (not safeIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can update farmer profile");
    };
    farmerProfile := ?profile;
  };

  public query ({ caller }) func getFarmerProfile() : async ?FarmerProfile {
    farmerProfile;
  };

  // Farm CRUD functions
  public shared ({ caller }) func createFarm(farm : Farm) : async () {
    if (not safeIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can create farms");
    };
    if (farms.containsKey(farm.id)) {
      Runtime.trap("Farm with this ID already exists");
    };
    farms.add(farm.id, farm);
  };

  public shared ({ caller }) func updateFarm(farm : Farm) : async () {
    if (not safeIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can update farms");
    };
    if (not farms.containsKey(farm.id)) {
      Runtime.trap("Farm does not exist");
    };
    farms.add(farm.id, farm);
  };

  public shared ({ caller }) func deleteFarm(farmId : Text) : async () {
    if (not safeIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can delete farms");
    };
    if (not farms.containsKey(farmId)) {
      Runtime.trap("Farm does not exist");
    };
    farms.remove(farmId);
  };

  public query ({ caller }) func getAllFarms() : async [Farm] {
    farms.values().toArray().sort(Farm.compareByTimestamp);
  };

  public query ({ caller }) func getFarmById(farmId : Text) : async ?Farm {
    farms.get(farmId);
  };

  // Farm photo CRUD functions
  public shared ({ caller }) func addFarmPhoto(photo : FarmPhoto) : async () {
    if (not safeIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can add farm photos");
    };
    if (farmPhotos.containsKey(photo.id)) {
      Runtime.trap("Photo with this ID already exists");
    };
    farmPhotos.add(photo.id, photo);
  };

  public shared ({ caller }) func updateFarmPhoto(photo : FarmPhoto) : async () {
    if (not safeIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can update farm photos");
    };
    if (not farmPhotos.containsKey(photo.id)) {
      Runtime.trap("Photo does not exist");
    };
    farmPhotos.add(photo.id, photo);
  };

  public shared ({ caller }) func deleteFarmPhoto(photoId : Text) : async () {
    if (not safeIsAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can delete farm photos");
    };
    if (not farmPhotos.containsKey(photoId)) {
      Runtime.trap("Photo does not exist");
    };
    farmPhotos.remove(photoId);
  };

  public query ({ caller }) func getPhotosByFarmId(farmId : Text) : async [FarmPhoto] {
    let photos = farmPhotos.values().toArray().filter(
      func(photo) { photo.farmId == farmId }
    );
    photos;
  };

  system func postupgrade() {
    seedFarmsIfEmpty();
    // Reset farmer profile to correct values after upgrade
    farmerProfile := ?{
      name = "Hemanth Mukku";
      location = "West Godavari, Andhra Pradesh, India";
      contactPhone = "+91 9398886020";
      contactEmail = "hemanthmukku3@gmail.com";
      about = "Third-generation shrimp farmer with over 20 years of experience in sustainable aquaculture. Our farms in West Godavari are known for premium quality Vannamei shrimp raised using best aquaculture practices. We supply to major seafood processing companies across Andhra Pradesh and beyond.";
    };
  };
};
