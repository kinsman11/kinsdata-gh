import React, { useEffect, useState } from 'react';
import { blink } from '@/lib/blink';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Zap, ShieldCheck, Clock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface Bundle {
  id: string;
  name: string;
  network: string;
  dataAmount: string;
  price: number;
  category: string;
}

const Home = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const data = await blink.db.bundles.list({
        where: { isActive: "1" }
      });
      setBundles(data as Bundle[]);
    } catch (error) {
      console.error('Error fetching bundles:', error);
      toast.error('Failed to load bundles');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!phoneNumber || !selectedBundle) {
      toast.error('Please enter phone number and select a bundle');
      return;
    }

    if (phoneNumber.length < 10) {
      toast.error('Invalid phone number');
      return;
    }

    try {
      toast.loading('Processing order...');
      
      const user = await blink.auth.me();
      if (!user) {
        blink.auth.login();
        return;
      }

      await blink.db.orders.create({
        userId: user.id,
        bundleId: selectedBundle.id,
        phoneNumber,
        amount: selectedBundle.price,
        network: selectedBundle.network,
        status: 'pending'
      });

      toast.dismiss();
      toast.success('Order placed successfully! Please check your phone for prompt.');
      setPhoneNumber('');
      setSelectedBundle(null);
    } catch (error) {
      toast.dismiss();
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  const filteredBundles = bundles.filter(b => b.network === selectedNetwork);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
        <Badge variant="outline" className="mb-4 py-1 px-4 text-primary border-primary/20 bg-primary/5">
          Fast & Secure Data
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Ghana's Most Reliable <span className="text-primary">Data Hub</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          Get high-speed data bundles for all networks in Ghana at the best prices. 
          Instant delivery, zero hassle.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm">
          <div className="flex items-center gap-2 justify-center">
            <Zap className="text-primary" size={16} /> Instant Delivery
          </div>
          <div className="flex items-center gap-2 justify-center">
            <ShieldCheck className="text-primary" size={16} /> Secure Payment
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Clock className="text-primary" size={16} /> 24/7 Support
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Smartphone className="text-primary" size={16} /> All Networks
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12 max-w-6xl mx-auto">
        {/* Bundle Selection */}
        <div className="space-y-8">
          <Tabs defaultValue="MTN" onValueChange={setSelectedNetwork} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto lg:mx-0">
              <TabsTrigger value="MTN">MTN</TabsTrigger>
              <TabsTrigger value="Vodafone">Telecel</TabsTrigger>
              <TabsTrigger value="AT">AirtelTigo</TabsTrigger>
            </TabsList>

            <div className="mt-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="animate-pulse h-32" />
                  ))}
                </div>
              ) : filteredBundles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBundles.map(bundle => (
                    <Card 
                      key={bundle.id} 
                      className={`cursor-pointer transition-all hover:border-primary/50 ${selectedBundle?.id === bundle.id ? 'border-primary ring-1 ring-primary' : ''}`}
                      onClick={() => setSelectedBundle(bundle)}
                    >
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{bundle.dataAmount}</CardTitle>
                          <Badge variant="secondary">{bundle.category}</Badge>
                        </div>
                        <CardDescription>{bundle.name}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="text-2xl font-bold text-primary">GH₵ {bundle.price.toFixed(2)}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-xl bg-muted/30">
                  <p className="text-muted-foreground">No bundles available for {selectedNetwork}</p>
                </div>
              )}
            </div>
          </Tabs>
        </div>

        {/* Purchase Form */}
        <div className="space-y-6">
          <Card className="sticky top-24 border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle>Complete Purchase</CardTitle>
              <CardDescription>Enter details to get your data bundle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    placeholder="024 XXX XXXX" 
                    className="pl-9"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Network</span>
                  <span className="font-medium">{selectedNetwork}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Selected Bundle</span>
                  <span className="font-medium">{selectedBundle?.dataAmount || 'None'}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">GH₵ {selectedBundle?.price.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-12 text-lg" 
                onClick={handlePurchase}
                disabled={!selectedBundle || !phoneNumber}
              >
                <CreditCard className="mr-2 h-5 w-5" /> Pay Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
