import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { blink } from '@/lib/blink';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Wallet, Users, Award, Briefcase, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const AgentPortal = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [agentData, setAgentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: ''
  });

  useEffect(() => {
    if (user) {
      fetchAgentData();
    }
  }, [user]);

  const fetchAgentData = async () => {
    try {
      const agents = await blink.db.agents.list({
        where: { userId: user?.id }
      });
      if (agents.length > 0) {
        setAgentData(agents[0]);
      }
    } catch (error) {
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setApplying(true);
      await blink.db.agents.create({
        userId: user.id,
        name: formData.name,
        contact: formData.contact,
        status: 'pending',
        commissionBalance: 0
      });
      toast.success('Application submitted successfully!');
      fetchAgentData();
    } catch (error) {
      console.error('Error applying:', error);
      toast.error('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (authLoading || loading) return <div className="p-8 text-center">Loading...</div>;

  // If not an agent and no application
  if (!agentData) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1">
              Join the Team
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight">Become a <span className="text-primary">GhanaData Agent</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Earn competitive commissions by selling data bundles to your community. 
              Join hundreds of agents across Ghana making extra income every day.
            </p>
            
            <ul className="space-y-4">
              {[
                { icon: <TrendingUp size={18} />, text: 'High commission rates on every sale' },
                { icon: <Wallet size={18} />, text: 'Instant payouts to your mobile money' },
                { icon: <Award size={18} />, text: 'Performance bonuses and rewards' },
                { icon: <Briefcase size={18} />, text: 'Full training and support provided' }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="border-primary/10 shadow-xl">
            <CardHeader>
              <CardTitle>Agent Application</CardTitle>
              <CardDescription>Fill in the details to start your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApply} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">WhatsApp / Phone Number</Label>
                  <Input 
                    id="contact" 
                    placeholder="024 XXX XXXX" 
                    required 
                    value={formData.contact}
                    onChange={e => setFormData({...formData, contact: e.target.value})}
                  />
                </div>
                <Button type="submit" className="w-full h-11" disabled={applying}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="text-xs text-center text-muted-foreground">
              By submitting, you agree to our agent terms and conditions.
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // If application is pending
  if (agentData.status === 'pending') {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Application Pending</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for applying to be a GhanaData agent! Our team is currently reviewing your 
          application. This usually takes 24-48 hours. We'll notify you once you're approved.
        </p>
        <Button variant="outline" onClick={() => window.location.href = '/'}>Back to Home</Button>
      </div>
    );
  }

  // If approved agent
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {agentData.name}</h1>
          <p className="text-muted-foreground">Manage your business and track commissions</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-4 py-1">
          <CheckCircle2 size={14} className="mr-2" /> Active Agent
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Commission Balance</CardDescription>
            <CardTitle className="text-3xl">GH₵ {agentData.commissionBalance.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full mt-2" variant="outline" size="sm">Withdraw Funds</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sales (This Month)</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp size={12} /> +0% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Referrals</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full mt-2" variant="outline" size="sm">Share Referral Link</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Commissions</CardTitle>
            <CardDescription>Your last 5 earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              No earnings yet. Start selling to earn commissions!
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Sale</CardTitle>
            <CardDescription>Sell a bundle directly to a customer</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Smartphone size={48} className="text-muted-foreground mb-4" />
            <p className="text-center mb-6 text-muted-foreground">
              Use the main buy page to process sales. Your agent ID will be automatically 
              linked to purchases made while you are logged in.
            </p>
            <Button onClick={() => window.location.href = '/'}>Start Selling</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentPortal;
