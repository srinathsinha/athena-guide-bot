import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Bot, Users, GitPullRequest, MessageSquare, BarChart3 } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Daily Digest",
      description: "AI-powered knowledge gap detection and team insights"
    },
    {
      icon: <GitPullRequest className="h-5 w-5" />,
      title: "Auto-PR Scenarios", 
      description: "Automated code improvements based on pattern analysis"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Expert Q&A Flow",
      description: "Slack-integrated expert consultation for complex decisions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Athena Slackbot Demo
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get to the "a-ha!" moment faster by leveraging experts to manage the knowledge graph from Slack
          </p>
        </div>

        {/* Problems */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardHeader>
            <CardTitle>Problems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <div className="flex-shrink-0 p-2 rounded-md bg-destructive/10 text-destructive">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Close lower-confidence gaps quickly</h3>
                  <p className="text-sm text-muted-foreground">Identifying and resolving knowledge gaps with low confidence requires rapid expert intervention</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <div className="flex-shrink-0 p-2 rounded-md bg-destructive/10 text-destructive">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Show immediate value</h3>
                  <p className="text-sm text-muted-foreground">Demonstrating tangible benefits from AI-powered knowledge management systems</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proposed Solutions */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardHeader>
            <CardTitle>Proposed Solutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                  <div className="flex-shrink-0 p-2 rounded-md bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Controls */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Ready to Explore?</CardTitle>
            <CardDescription>
              Start with the Daily Digest to see Athena's knowledge gap analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/demo?scenario=digest')}
              className="flex items-center gap-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              Start Demo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/demo?scenario=digest&help=true')}
              size="lg"
            >
              <Users className="h-4 w-4 mr-2" />
              Guided Tour
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>This is a demonstration of AI-powered engineering workflows.</p>
          <p className="mt-1">All data shown is simulated for demo purposes.</p>
        </div>
      </div>
    </div>
  );
}