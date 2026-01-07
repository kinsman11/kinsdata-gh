import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { blink } from '@/lib/blink';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Check, X, Users, Package, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [bundles, setBundles] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Bundle Form
  const [newBundle, setNewBundle] = useState({
    name: '',
    network: 'MTN',
    dataAmount: '',
    price: '',
    category: 'Standard'
  });

  useEffect(() => {
    if (role === 'admin') {
      fetchData();
    }
  }, [role]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bData, aData, oData] = await Promise.all([
        blink.db.bundles.list(),
        blink.db.agents.list(),
        blink.db.orders.list({ orderBy: { createdAt: 'desc' } })
      ]);
      setBundles(bData);
      setAgents(aData);
      setOrders(oData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await blink.db.bundles.create({
        ...newBundle,
        price: parseFloat(newBundle.price),
        isActive: "1"
      });
      toast.success('Bundle added successfully');
      setNewBundle({ name: '', network: 'MTN', dataAmount: '', price: '', category: 'Standard' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add bundle');
    }
  };

  const toggleBundleStatus = async (id: string, currentStatus: any) => {
    try {
      await blink.db.bundles.update(id, {
        isActive: Number(currentStatus) > 0 ? "0" : "1"
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const approveAgent = async (id: string) => {
    try {
      await blink.db.agents.update(id, { status: 'active' });
      // Also update profile role to agent
      const agent = agents.find(a => a.id === id);
      if (agent) {
        await blink.db.profiles.update(agent.userId, { role: 'agent' });
      }
      toast.success('Agent approved');
      fetchData();
    } catch (error) {
      toast.error('Failed to approve agent');
    }
  };

  if (authLoading) return <div className="p-8 text-center">Loading auth...</div>;
  if (role !== 'admin') return <div className="p-8 text-center text-destructive font-bold">Access Denied</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={fetchData} variant="outline" size="sm">Refresh Data</Button>
      </div>

      <Tabs defaultValue="bundles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bundles"><Package className="mr-2 h-4 w-4" /> Bundles</TabsTrigger>
          <TabsTrigger value="agents"><Users className="mr-2 h-4 w-4" /> Agents</TabsTrigger>
          <TabsTrigger value="orders"><ShoppingCart className="mr-2 h-4 w-4" /> Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="bundles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Bundle</CardTitle>
              <CardDescription>Define a new data offering for customers</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBundle} className="grid md:grid-cols-5 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={newBundle.name} onChange={e => setNewBundle({...newBundle, name: e.target.value})} placeholder="Bundle name" required />
                </div>
                <div className="space-y-2">
                  <Label>Network</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newBundle.network}
                    onChange={e => setNewBundle({...newBundle, network: e.target.value})}
                  >
                    <option value="MTN">MTN</option>
                    <option value="Vodafone">Telecel</option>
                    <option value="AT">AirtelTigo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Data Amount</Label>
                  <Input value={newBundle.dataAmount} onChange={e => setNewBundle({...newBundle, dataAmount: e.target.value})} placeholder="e.g. 5GB" required />
                </div>
                <div className="space-y-2">
                  <Label>Price (GH₵)</Label>
                  <Input type="number" step="0.01" value={newBundle.price} onChange={e => setNewBundle({...newBundle, price: e.target.value})} placeholder="0.00" required />
                </div>
                <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Add</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Bundles</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Network</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bundles.map(b => (
                    <TableRow key={b.id}>
                      <TableCell><Badge variant="outline">{b.network}</Badge></TableCell>
                      <TableCell className="font-medium">{b.name}</TableCell>
                      <TableCell>{b.dataAmount}</TableCell>
                      <TableCell>GH₵ {b.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={Number(b.isActive) > 0 ? 'default' : 'secondary'}>
                          {Number(b.isActive) > 0 ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleBundleStatus(b.id, b.isActive)}
                        >
                          {Number(b.isActive) > 0 ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <CardTitle>Agent Management</CardTitle>
              <CardDescription>Manage agent applications and recruitment</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell>{a.contact}</TableCell>
                      <TableCell>
                        <Badge variant={a.status === 'active' ? 'default' : 'warning'}>
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell>GH₵ {a.commissionBalance.toFixed(2)}</TableCell>
                      <TableCell>
                        {a.status === 'pending' && (
                          <Button size="sm" onClick={() => approveAgent(a.id)}>Approve</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {agents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No agents found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(o => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs">{o.id}</TableCell>
                      <TableCell><Badge variant="outline">{o.network}</Badge></TableCell>
                      <TableCell>{o.phoneNumber}</TableCell>
                      <TableCell>GH₵ {o.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={o.status === 'completed' ? 'default' : 'secondary'}>
                          {o.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
