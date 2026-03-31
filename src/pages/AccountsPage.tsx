import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Facebook, Instagram, Twitter } from 'lucide-react';

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

export default function AccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('connected_accounts')
      .select('id, platform, username, avatar_url, is_active')
      .eq('user_id', user.id);
    setAccounts((data as ConnectedAccount[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const handleConnect = async (platform: string) => {
    if (platform === 'facebook' || platform === 'facebook_page' || platform === 'instagram') {
      try {
        const res = await fetch('https://2ee2-2001-fb1-48-e162-6010-228a-85e4-8485.ngrok-free.app/webhook/oauth/meta/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user?.id }),
        });
        const data = await res.json();
        if (data.auth_url) {
          window.location.href = data.auth_url;
        } else {
          alert('ไม่สามารถเชื่อมต่อได้ กรุณาลองอีกครั้ง');
        }
      } catch {
        alert('ไม่สามารถเชื่อมต่อได้ กรุณาลองอีกครั้ง');
      }
    }
  };

  const handleDisconnect = async (accountId: string) => {
    await supabase
      .from('connected_accounts')
      .update({ is_active: false })
      .eq('id', accountId);
    fetchAccounts();
  };

  const allPlatforms = ['facebook', 'facebook_page', 'instagram', 'x', 'tiktok'];
  const connectedPlatforms = accounts.filter((a) => a.is_active).map((a) => a.platform);

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">บัญชีที่เชื่อมต่อ</h1>
          <p className="text-sm text-muted-foreground">จัดการบัญชีโซเชียลมีเดียของคุณ</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {allPlatforms.map((platform) => {
              const config = platformConfig[platform];
              const account = accounts.find((a) => a.platform === platform && a.is_active);
              const PlatformIcon = config.icon;
              const isComingSoon = platform === 'x' || platform === 'tiktok';

              return (
                <Card key={platform} className="border-border bg-card">
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-secondary ${config.color}`}>
                        <PlatformIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{config.label}</p>
                        {account ? (
                          <p className="text-sm text-muted-foreground">@{account.username}</p>
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
