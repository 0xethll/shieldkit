import { AppLayout } from '@/components/AppLayout'
import { HeroSection } from '@/components/home/HeroSection'
import { ProblemSolution } from '@/components/home/ProblemSolution'
import { UseCases } from '@/components/home/UseCases'
import { FlowDiagram } from '@/components/home/FlowDiagram'
import { TechnologyStack } from '@/components/home/TechnologyStack'

export default function Home() {
  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent max-w-4xl mx-auto" />

        {/* Problem & Solution */}
        <ProblemSolution />

        {/* Use Cases */}
        <UseCases />

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent max-w-4xl mx-auto" />

        {/* Flow Diagram */}
        <FlowDiagram />

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent max-w-4xl mx-auto" />

        {/* Technology Stack */}
        <TechnologyStack />

        {/* Footer Spacer */}
        <div className="h-20" />
      </div>
    </AppLayout>
  )
}
