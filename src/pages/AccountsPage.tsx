import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Facebook, Instagram, Twitter, CheckCircle } from 'lucide-react';

const platformConfig: Record<string, { label: string; icon: any; color: string }> = {
  facebook: { label: 'Facebook', icon: Facebook, color: 'text-blue-500' },
  facebook_page: { label: 'Facebook Page', icon: Facebook, color: 'text-blue-600' },
  instagram: { label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  x: { label: 'X (Twitter)', icon: Twitter, color: 'text-foreground' },
  tiktok: { label: 'TikTok', icon: () => <span className="text-sm font-bold">TT</span>, color: 'text-foreground' },
};

interface ConnectedAccount {
  id: string;
  platform: string;
  username: string;
  avatar_url: string | null;
  is_active: boolean;
}

const N8N_URL = 'https://2ee2-2001-fb1-48-e162-6010-228a-85e4-8485.ngrok-free.app';

export default function AccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [justConnected, setJustConnected] = useState(false);

  const fetchAccounts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('social_accounts')
      .select('id, platform, username, avatar_url, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true);
    setAccounts((data as ConnectedAccount[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
    // Show success message if redirected back after OAuth
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected') === 'true') {
      setJustConnected(true);
      // Clean URL
      window.history.replaceState({}, '', '/accounts');
    }
  }, [user]);

  const handleConnect = (platform: string) => {
    if (platform === 'facebook' || platform === 'facebook_page' || platform === 'instagram') {
      window.location.href = `${N8N_URL}/webhook/oauth/meta/start?user_id=${user?.id}`;
    }
  };

  const handleDisconnect = async (accountId: string) => {
    await supabase
      .from('social_accounts')
      .update({ is_active: false })
      .eq('id', accountId);
    fetchAccounts();
  };

  const allPlatforms = ['facebook', 'facebook_page', 'instagram', 'x', 'tiktok'];

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">บัญชีที่เชื่อมต่อ</h1>
          <p className="text-sm text-muted-foreground">จัดการบัญชีโซเชียลมีเดียของคุณ</p>
        </div>

        {justConnected && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">เชื่อมต่อบัญชีสำเร็จแล้ว!</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {allPlatforms.map((platform) => {
              const config = platformConfig[platform];
              const account = accounts.find((a) => a.platform === platform);
              const PlatformIcon = config.icon;
              const isComingSoon = platform === 'x' || platform === 'tiktok';

              return (
                <Card key={platform} className={`border-border bg-card ${account ? 'border-green-500/30' : ''}`}>
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-secondary ${config.color}`}>
                        <PlatformIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{config.label}</p>
                        {account ? (
                          <p className="text-sm text-green-400">@{account.username}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">ยังไม่ได้เชื่อมต่อ</p>
                        )}
                      </div>
                    </div>
                    <div>
                      {isComingSoon ? (
                        <Badge variant="secondary" className="text-xs">เร็วๆ นี้</Badge>
                      ) : account ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(account.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          ยกเลิกการเชื่อมต่อ
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleConnect(platform)}>
                          เชื่อมต่อ
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
