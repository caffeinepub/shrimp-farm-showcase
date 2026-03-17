import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Award,
  ChevronRight,
  Droplets,
  Fish,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Farm } from "../backend";
import FarmCard from "../components/FarmCard";
import FarmDetailModal from "../components/FarmDetailModal";
import { useAllFarms, useFarmerProfile } from "../hooks/useQueries";

const STATIC_PROFILE = {
  name: "Hemanth Mukku",
  about:
    "Third-generation shrimp farmer with over 20 years of experience in sustainable aquaculture. Our farms in West Godavari are known for premium quality Vannamei shrimp raised using best aquaculture practices. We supply to major seafood processing companies across Andhra Pradesh and beyond.",
  location: "West Godavari, Andhra Pradesh, India",
  contactPhone: "+91 9398886020",
  contactEmail: "hemanthmukku3@gmail.com",
};

const STATIC_FARMS = [
  {
    id: "farm-1",
    created: BigInt(0),
    name: "Godavari Aqua Farm - Unit 1",
    description:
      "Our flagship 40-acre facility with 24 scientifically designed rectangular ponds. Equipped with automated aeration, water quality monitoring, and biosecurity protocols.",
    acreage: 40,
    pondCount: BigInt(24),
    species: "Litopenaeus vannamei (Vannamei)",
    productionCapacity: 120,
    certifications: ["BMP Certified", "MPEDA Registered", "EIC Approved"],
  },
  {
    id: "farm-2",
    created: BigInt(0),
    name: "Delta Shrimp Farm - Unit 2",
    description:
      "Semi-intensive farm utilizing natural tidal water exchange with modern paddlewheel aerators. Focus on organic and antibiotic-free shrimp production.",
    acreage: 28,
    pondCount: BigInt(16),
    species: "Litopenaeus vannamei (Vannamei)",
    productionCapacity: 80,
    certifications: ["BAP 4-Star", "MPEDA Registered"],
  },
  {
    id: "farm-3",
    created: BigInt(0),
    name: "Kolleru Aquaculture Park",
    description:
      "Expansive 65-acre aquaculture park with integrated mangrove buffer zones. Premium export-grade shrimp with full chain of custody documentation.",
    acreage: 65,
    pondCount: BigInt(36),
    species: "Penaeus monodon (Tiger Shrimp)",
    productionCapacity: 180,
    certifications: [
      "ASC Certified",
      "BMP Certified",
      "HACCP",
      "MPEDA Registered",
    ],
  },
];

const STATS = [
  { value: "3+", label: "Active Farms" },
  { value: "20+ yrs", label: "Experience" },
  { value: "Export Grade", label: "Quality Standard" },
];

const WHY_PARTNER = [
  {
    icon: "🦐",
    title: "Premium Species",
    desc: "Vannamei & Tiger shrimp, globally demanded species",
  },
  {
    icon: "📜",
    title: "Certified Operations",
    desc: "BMP, ASC, BAP, MPEDA certifications maintained",
  },
  {
    icon: "🌊",
    title: "Prime Location",
    desc: "Fertile Godavari delta with ideal water quality",
  },
  {
    icon: "🤝",
    title: "Reliable Supply",
    desc: "Consistent batch scheduling and production forecasting",
  },
];

export default function HomePage() {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: profile, isLoading: profileLoading } = useFarmerProfile();
  const { data: farmsData, isLoading: farmsLoading } = useAllFarms();

  const displayProfile = profile || STATIC_PROFILE;
  const farms = farmsData && farmsData.length > 0 ? farmsData : STATIC_FARMS;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fish className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg text-foreground">
              Hemanth Shrimp Farms
            </span>
          </div>
          <nav
            className="hidden md:flex items-center gap-6"
            data-ocid="main.section"
          >
            <button
              type="button"
              onClick={() => scrollTo("farms")}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              data-ocid="nav.link"
            >
              Our Farms
            </button>
            <button
              type="button"
              onClick={() => scrollTo("about")}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              data-ocid="nav.link"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              data-ocid="nav.link"
            >
              Contact
            </button>
            <Link to="/admin">
              <Button
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                data-ocid="admin.link"
              >
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Admin
              </Button>
            </Link>
          </nav>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            data-ocid="nav.toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-background border-t border-border px-4 py-4 flex flex-col gap-4"
          >
            <button
              type="button"
              onClick={() => scrollTo("farms")}
              className="text-sm font-medium text-left"
            >
              Our Farms
            </button>
            <button
              type="button"
              onClick={() => scrollTo("about")}
              className="text-sm font-medium text-left"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="text-sm font-medium text-left"
            >
              Contact
            </button>
            <Link to="/admin">
              <Button
                size="sm"
                variant="outline"
                className="w-full border-primary text-primary"
              >
                Admin Panel
              </Button>
            </Link>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.08 210) 0%, oklch(0.38 0.12 195) 50%, oklch(0.48 0.13 185) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-shrimp-farm.dim_1600x900.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />
        <div className="container max-w-6xl mx-auto px-4 pt-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-accent text-accent-foreground px-3 py-1 text-sm font-medium">
                <MapPin className="w-3 h-3 mr-1 inline" />
                West Godavari, Andhra Pradesh
              </Badge>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              {profileLoading ? (
                <Skeleton className="h-20 w-96 bg-white/20" />
              ) : (
                displayProfile.name
              )}
            </h1>
            <p className="text-xl md:text-2xl text-white/85 font-body mb-8 leading-relaxed">
              Premium Quality Shrimp Farming • Sustainable Aquaculture • Export
              Grade Produce
            </p>
            <p className="text-white/70 text-lg mb-10 max-w-xl">
              Partnering with aquaculture companies across India and
              internationally to deliver farm-fresh, certified shrimp from the
              fertile delta lands of Godavari.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => scrollTo("farms")}
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 shadow-hero"
                data-ocid="hero.primary_button"
              >
                View Our Farms <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("contact")}
                className="border-white text-white hover:bg-white/10 px-8"
                data-ocid="hero.secondary_button"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="container max-w-6xl mx-auto px-4 py-5 grid grid-cols-3 gap-4 text-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-white">
                <div className="font-display text-2xl md:text-3xl font-bold">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Farms Section */}
      <section id="farms" className="py-20 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Our Properties
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Farm Portfolio
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Each farm is strategically located in the fertile delta region,
              with dedicated infrastructure for premium shrimp production.
            </p>
          </motion.div>

          {farmsLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="farms.loading_state"
            >
              {["a", "b", "c"].map((k) => (
                <Skeleton key={k} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farms.map((farm, idx) => (
                <motion.div
                  key={farm.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  data-ocid={`farms.item.${idx + 1}`}
                >
                  <FarmCard farm={farm} onClick={() => setSelectedFarm(farm)} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  About the Farmer
                </span>
              </div>
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                {profileLoading ? (
                  <Skeleton className="h-12 w-64" />
                ) : (
                  displayProfile.name
                )}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {profileLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  displayProfile.about
                )}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{displayProfile.location}</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-hero">
                <img
                  src="/assets/generated/farm-pond-1.dim_800x600.jpg"
                  alt="Shrimp aquaculture ponds"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-card p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Fish className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      Export Quality
                    </div>
                    <div className="text-xs text-muted-foreground">
                      BMP & ASC Certified
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Why Partner With Us
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We provide aquaculture companies with direct access to certified,
              high-yield shrimp farms
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_PARTNER.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-hero transition-shadow"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.08 210) 0%, oklch(0.38 0.12 195) 100%)",
        }}
      >
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Partner?
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Aquaculture companies interested in farm visits, bulk purchasing,
              or long-term supply agreements are welcome to get in touch.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href={`tel:${displayProfile.contactPhone}`}
                className="flex items-center gap-3 bg-white/15 hover:bg-white/25 transition-colors rounded-xl px-6 py-4 text-white"
                data-ocid="contact.primary_button"
              >
                <Phone className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-white/70">Call Us</div>
                  <div className="font-semibold">
                    {displayProfile.contactPhone}
                  </div>
                </div>
              </a>
              <a
                href={`mailto:${displayProfile.contactEmail}`}
                className="flex items-center gap-3 bg-white/15 hover:bg-white/25 transition-colors rounded-xl px-6 py-4 text-white"
                data-ocid="contact.secondary_button"
              >
                <Mail className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-white/70">Email Us</div>
                  <div className="font-semibold">
                    {displayProfile.contactEmail}
                  </div>
                </div>
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-white/60">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{displayProfile.location}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-8">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Fish className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-white">
              Hemanth Shrimp Farms
            </span>
          </div>
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="text-primary hover:text-primary/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {selectedFarm && (
        <FarmDetailModal
          farm={selectedFarm}
          onClose={() => setSelectedFarm(null)}
        />
      )}
    </div>
  );
}
