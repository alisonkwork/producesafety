import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Leaf, ShieldCheck, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* Left Panel - Hero Content */}
      <div className="lg:w-[55%] flex flex-col justify-between p-10 lg:p-20 bg-gradient-to-br from-green-50 via-emerald-50/40 to-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-green-200/15 rounded-full blur-[120px] -mr-24 -mt-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[24rem] h-[24rem] bg-emerald-100/25 rounded-full blur-[120px] -ml-24 -mb-24 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-serif font-bold text-foreground tracking-tight">Agrifood Safety</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-foreground leading-tight mb-8">
              Produce Safety Recordkeeping, <br/>
              <span className="text-primary">Simplified.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
              Easily manage and organize your produce safety records, determine your coverage status, and stay FSMA compliant.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="p-5 rounded-2xl bg-white/70 border border-green-100/70 shadow-sm backdrop-blur">
              <ShieldCheck className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Determine your FSMA Coverage Status</h3>
              <p className="text-sm text-muted-foreground">Quickly figure out what records your farm needs to keep under the FSMA Produce Safety Rule.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/70 border border-green-100/70 shadow-sm backdrop-blur">
              <FileCheck className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Organize Digital Records</h3>
              <p className="text-sm text-muted-foreground">Keep all your produce safety records organized and accessible in one place.</p>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-12 text-sm text-muted-foreground font-medium">
          &copy; {new Date().getFullYear()} Agrifood Safety
        </div>
      </div>

      {/* Right Panel - Login CTA */}
      <div className="lg:w-[45%] bg-white/80 flex items-center justify-center p-10 lg:p-20 border-l border-green-50/70">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-foreground">Welcome Back</h2>
            <p className="mt-2 text-muted-foreground">Sign in to access your farm's dashboard</p>
          </div>

          <div className="space-y-4 pt-4">
            <a href="/api/login" className="block">
              <Button size="lg" className="w-full text-base py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all">
                Sign In to Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            
            <p className="text-xs text-center text-muted-foreground pt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              <br/>We prioritize the security of your farm data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
