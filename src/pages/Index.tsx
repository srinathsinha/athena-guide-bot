import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AthenaDigest } from "@/components/AthenaDashboard/AthenaDigest";
import { AutoPRScenario } from "@/components/AthenaDashboard/AutoPRScenario";
import { ExpertQAScenario } from "@/components/AthenaDashboard/ExpertQAScenario";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockDailyDigest, mockKnowledgeGaps } from "@/data/mockData";
import { Scenario } from "@/types/athena";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentScenario, setCurrentScenario] = useState<Scenario>('digest');
  const [selectedGapId, setSelectedGapId] = useState<string>();

  useEffect(() => {
    const scenario = searchParams.get('scenario') as Scenario;
    const gapId = searchParams.get('gap');
    
    if (scenario && ['digest', 'auto-pr', 'qna'].includes(scenario)) {
      setCurrentScenario(scenario);
    }
    
    if (gapId) {
      setSelectedGapId(gapId);
    }
  }, [searchParams]);

  const handleScenarioChange = (scenario: Scenario, gapId?: string) => {
    setCurrentScenario(scenario);
    setSelectedGapId(gapId);
    
    const params = new URLSearchParams();
    params.set('scenario', scenario);
    if (gapId) params.set('gap', gapId);
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
    // Demo action - could show success toast
    console.log('PR Approved');
  };

  const handleReject = () => {
    // Demo action - could show rejection dialog
    console.log('PR Rejected');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Resolve.ai – Athena Slackbot</h1>
              <p className="text-muted-foreground">Expert Feedback Flow Demo</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={currentScenario === 'digest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleScenarioChange('digest')}
              >
                Daily Digest
              </Button>
              <Button
                variant={currentScenario === 'auto-pr' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleScenarioChange('auto-pr', 'retry-logic-stripe')}
              >
                Auto-PR Flow
              </Button>
              <Button
                variant={currentScenario === 'qna' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleScenarioChange('qna', 'feature-flag-invoice')}
              >
                Expert Q&A Flow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
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
              digest={mockDailyDigest}
              onViewThread={handleViewThread}
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
            <ExpertQAScenario gap={selectedGap} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
