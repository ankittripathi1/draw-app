import { FeatureItem } from "@repo/ui/feature-item";
import { Share2, Users2, Sparkles } from "lucide-react";

export const FeatureSection = () => {
  return (
    <section className="py-24 w-full bg-white dark:bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
            Powerful Features for Seamless Collaboration
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Everything you need to bring your ideas to life, together.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureItem
            title="Real-time Collaboration"
            description="Work together with your team in real-time. Share your drawings instantly with a simple link."
            icon={<Share2 />}
          />
          <FeatureItem
            title="Multiplayer Editing"
            description="Multiple users can edit the same canvas simultaneously. See who's drawing what in real-time."
            icon={<Users2 />}
          />
          <FeatureItem
            title="Smart Drawing"
            description="Intelligent shape recognition and drawing assistance helps you create perfect diagrams."
            icon={<Sparkles />}
          />
        </div>
      </div>
    </section>
  );
};
