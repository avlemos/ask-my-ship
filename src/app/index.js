import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [playerData, setPlayerData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleWargamingAuth = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
      if (!redirectUri) {
        throw new Error('Redirect URI is not defined');
      }

      // Redirect to Wargaming auth page
      window.location.href = `https://api.worldofwarships.com/wot/auth/login/?application_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(redirectUri)}`;
    } catch (err) {
      setError(err.message || 'Authentication failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">World of Warships Stats Analyzer</h1>
        </CardHeader>
        <CardContent>
          {!playerData ? (
            <div className="text-center">
              <Button 
                onClick={handleWargamingAuth}
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Connect World of Warships Account'}
              </Button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          ) : (
            <div>
              {/* Player stats will be displayed here */}
              <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(playerData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}