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
    name = "Raj Shrimp Farms";
    location = "West Godavari, Andhra Pradesh";
    contactPhone = "1234567890";
    contactEmail = "contact@rajshrimpfarms.com";
    about = "Raj Shrimp Farms is committed to sustainable and high-quality shrimp production.";
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

  system func preupgrade() {
    let sampleFarms = [
      {
        id = "farm1";
        name = "Sunshine Shrimp Farm";
        description = "A modern facility focusing on Vannamei shrimp";
        acreage = 25.0;
        pondCount = 8;
        species = "Vannamei";
        productionCapacity = 80.0;
        certifications = ["BAP", "ASC"];
        created = Time.now();
      },
      {
        id = "farm2";
        name = "Royal Prawn Estate";
        description = "Traditional farm specializing in Tiger Shrimp";
        acreage = 12.0;
        pondCount = 3;
        species = "Tiger Shrimp";
        productionCapacity = 28.0;
        certifications = ["Local certification"];
        created = Time.now();
      },
      {
        id = "farm3";
        name = "Eco Aqua Farms";
        description = "Eco-friendly farm with diverse shrimp species";
        acreage = 37.5;
        pondCount = 11;
        species = "Mixed (Tiger & Vannamei)";
        productionCapacity = 117.0;
        certifications = ["BAP"];
        created = Time.now();
      },
    ];

    for (farm in sampleFarms.values()) {
      farms.add(farm.id, farm);
    };
  };
};
