import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AthenaDigest } from "@/components/AthenaDashboard/AthenaDigest";
import { AutoPRScenario } from "@/components/AthenaDashboard/AutoPRScenario";
import { ExpertQAScenario } from "@/components/AthenaDashboard/ExpertQAScenario";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mockDailyDigest, mockKnowledgeGaps, getUpdatedDigestAfterApproval } from "@/data/mockData";
import { Scenario } from "@/types/athena";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Home, HelpCircle, ChevronRight, Info } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentScenario, setCurrentScenario] = useState<Scenario>('digest');
  const [selectedGapId, setSelectedGapId] = useState<string>();
  const [approvedGaps, setApprovedGaps] = useState<Set<string>>(new Set());
  const [showHelp, setShowHelp] = useState(false);
  const [guidedTourStep, setGuidedTourStep] = useState(0);

  useEffect(() => {
    const scenario = searchParams.get('scenario') as Scenario;
    const gapId = searchParams.get('gap');
    const helpParam = searchParams.get('help');
    
    if (scenario && ['digest', 'auto-pr', 'qna'].includes(scenario)) {
      setCurrentScenario(scenario);
    }
    
    if (gapId) {
      setSelectedGapId(gapId);
    }

    if (helpParam === 'true') {
      setShowHelp(true);
      setGuidedTourStep(1);
    }
  }, [searchParams]);

  const handleScenarioChange = (scenario: Scenario, gapId?: string) => {
    setCurrentScenario(scenario);
    setSelectedGapId(gapId);
    
    const params = new URLSearchParams();
    params.set('scenario', scenario);
    if (gapId) params.set('gap', gapId);
    if (showHelp) params.set('help', 'true');
    setSearchParams(params);
  };

  const resetDemo = () => {
    setApprovedGaps(new Set());
    setShowHelp(false);
    setGuidedTourStep(0);
    handleScenarioChange('digest');
    toast({
      title: "Demo Reset",
      description: "All demo progress has been cleared. Starting fresh!",
    });
  };

  const toggleGuidedTour = () => {
    const newHelpState = !showHelp;
    setShowHelp(newHelpState);
    setGuidedTourStep(newHelpState ? 1 : 0);
    
    const params = new URLSearchParams(searchParams);
    if (newHelpState) {
      params.set('help', 'true');
    } else {
      params.delete('help');
    }
    setSearchParams(params);
  };

  const handleViewThread = (gapId: string) => {
    const gap = mockKnowledgeGaps.find(g => g.id === gapId);
    if (gap) {
      handleScenarioChange(gap.action === 'auto-pr' ? 'auto-pr' : 'qna', gapId);
    }
  };

  const selectedGap = mockKnowledgeGaps.find(g => g.id === selectedGapId);

  const handleApprove = () => {
    if (selectedGapId) {
      // Show merge success
      toast({
        title: "✅ PR Merged Successfully",
        description: "Retry logic standardized and knowledge graph updated!",
      });

      // Add to approved gaps
      setApprovedGaps(prev => new Set([...prev, selectedGapId]));

      // Navigate back to digest after a brief delay
      setTimeout(() => {
        handleScenarioChange('digest');
      }, 1500);
    }
  };

  const handleExpertQAComplete = () => {
    if (selectedGapId) {
      // Show expert response success
      toast({
        title: "✅ Expert Feedback Integrated",
        description: "Documentation updated and knowledge graph improved!",
      });

      // Add to approved gaps
      setApprovedGaps(prev => new Set([...prev, selectedGapId]));

      // Navigate back to digest after a brief delay
      setTimeout(() => {
        handleScenarioChange('digest');
      }, 1500);
    }
  };

  const handleReject = () => {
    toast({
      title: "PR Rejected",
      description: "The proposed changes will not be merged.",
      variant: "destructive"
    });
  };

  // Get current digest with approval status
  const currentDigest = approvedGaps.size > 0 
    ? getUpdatedDigestAfterApproval(Array.from(approvedGaps)[0], approvedGaps)
    : mockDailyDigest;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Athena Slackbot Demo</h1>
              <p className="text-muted-foreground">AI-Powered Engineering Knowledge Management</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-1"
              >
                <Home className="h-4 w-4" />
                Welcome
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleGuidedTour}
                className="flex items-center gap-1"
              >
                <HelpCircle className="h-4 w-4" />
                {showHelp ? 'Hide Help' : 'Help'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetDemo}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Guided Tour Help */}
          {showHelp && (
            <Alert className="border-primary/20 bg-primary/5">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {currentScenario === 'digest' && (
                  <div className="space-y-2">
                    <p><strong>Daily Digest:</strong> This shows knowledge gaps Athena detected in your codebase.</p>
                    <p>• High confidence gaps get automated PRs</p>
                    <p>• Medium confidence gaps need expert review</p>
                    <p>Try clicking "View Thread" on any gap to see the detailed flow →</p>
                  </div>
                )}
                {currentScenario === 'auto-pr' && (
                  <div className="space-y-2">
                    <p><strong>Auto-PR Flow:</strong> Athena creates pull requests with multiple implementation options.</p>
                    <p>• Based on existing patterns in your codebase</p>
                    <p>• Shows commit diffs and code changes</p>
                    <p>Try approving or rejecting the PR to see what happens →</p>
                  </div>
                )}
                {currentScenario === 'qna' && (
                  <div className="space-y-2">
                    <p><strong>Expert Q&A:</strong> Slack-integrated expert consultation for complex decisions.</p>
                    <p>• Athena asks domain experts for guidance</p>
                    <p>• Shows incident context and pattern analysis</p>
                    <p>Try selecting a pattern (A, B, or C) to see the expert response →</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Scenario Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Current Scenario: {currentScenario === 'digest' ? 'Daily Digest' : 
                               currentScenario === 'auto-pr' ? 'Auto-PR (High Confidence)' : 
                               'Expert Q&A (Medium Confidence)'}
            </Badge>
            {selectedGap && (
              <Badge variant="outline">
                Gap: {selectedGap.title}
              </Badge>
            )}
          </div>

          {/* Content based on scenario */}
          {currentScenario === 'digest' && (
            <AthenaDigest 
              digest={currentDigest}
              onViewThread={handleViewThread}
              approvedGaps={approvedGaps}
            />
          )}

          {currentScenario === 'auto-pr' && selectedGap && (
            <AutoPRScenario
              gap={selectedGap}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {currentScenario === 'qna' && selectedGap && (
            <ExpertQAScenario gap={selectedGap} onComplete={handleExpertQAComplete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
