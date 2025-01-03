"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MLCEngine } from "@mlc-ai/web-llm";
import LoadingProgress from '@/components/LoadingProgress';
// import StatsDisplay from '@/components/StatsDisplay';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import { PlayerStats } from '@/lib/types';
import { analyzePlayerStats, limitPvpOccurrences } from '@/lib/utils';
import { Ship } from 'lucide-react';


export default function Home() {
  const [playerData, setPlayerData] = useState<PlayerStats | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState({
    progress: 0,
    total: 0,
    stage: 'Initializing'
  });
  const [authData, setAuthData] = useState<{
    accessToken?: string;
    accountId?: string;
    nickname?: string;
  } | null>(null);

  // Check for auth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const accountId = params.get('account_id');
    const nickname = params.get('nickname');
    const error = params.get('error');

    if (error) {
      setError('Authentication failed. Please try again.');
      return;
    }

    if (accessToken && accountId) {
      setAuthData({
        accessToken,
        accountId,
        nickname: nickname || undefined
      });
      // Clear the URL parameters without triggering a refresh
      window.history.replaceState({}, '', '/');
      // Fetch player stats
      fetchPlayerStats(accessToken, accountId);
    }
  }, []);

  const fetchPlayerStats = async (token: string, accountId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/fetch-stats?token=${token}&account_id=${accountId}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPlayerData(data);
    } catch (err) {
      setError('Failed to fetch player stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to react to changes in playerData
  useEffect(() => {
    if (playerData) {
      const initProgressCallback = (report: any) => {
        //console.log("Init progress:", report);
        setLoadingProgress({
          progress: report.progress || 0,
          total: report.total || 3886,//4309, //Hermes-3-Llama-3.1-8B-q4f16_1-MLC
          stage: report.text || 'Loading model...'
        });
      };

      const loadModel = async () => {
        try {
          setModelLoading(true);
          const engineInstance = new MLCEngine({ initProgressCallback });
          await engineInstance.reload("Hermes-2-Pro-Mistral-7B-q4f16_1-MLC");//smallest
          //await engineInstance.reload("Hermes-3-Llama-3.1-8B-q4f16_1-MLC");//2nd smallest
          setModel(engineInstance);
          setModelLoading(false);
          
          // Optionally, analyze  s with the model
          setLoading(true);
          const analysis = await analyzePlayerStats(engineInstance, playerData);
          console.log('Analysis:', analysis);
          setAnalysis(analysis);
          setLoading(false);
        } catch (err) {
          setError('Failed to load model');
          console.error(err);
        }
      };

      loadModel();
    }
  }, [playerData]);

  async function analyseStats() {
    setAnalysis(null);
    setLoading(true);
    if (playerData) {
      const analysis = await analyzePlayerStats(model, playerData);
    }
    console.log('Analysis:', analysis);
    setAnalysis(analysis);
    setLoading(false);
  }

  const handleWargamingAuth = () => {

    if (!process.env.NEXT_PUBLIC_REDIRECT_URI || !process.env.NEXT_PUBLIC_WARGAMING_APP_ID) {
      throw new Error('Missing environment variables');
    }

    try {
      setLoading(true);
      const openidUrl = 'https://api.worldoftanks.eu/wot/auth/login/';

      const params = new URLSearchParams({
        application_id: process.env.NEXT_PUBLIC_WARGAMING_APP_ID,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
      });

      window.location.href = `${openidUrl}?${params.toString()}`;
    } catch (err) {
      setError('Failed to initiate Wargaming authentication');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="border-b bg-white px-6 py-4">
          <CardTitle className="flex items-center text-2xl font-bold text-gray-900">
            <Ship className="mr-2 h-6 w-6 text-blue-600" />
            World of Warships Stats Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className='mt-4'>
          {modelLoading ? (
            <LoadingProgress
              message="Loading AI Model"
              progress={loadingProgress.progress}
              total={loadingProgress.total}
              stage={loadingProgress.stage}
            />
          ) : !playerData ? (
            <div className="text-center">
              <Button
                onClick={handleWargamingAuth}
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Connect World of Warships Account'}
              </Button>
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {/* {<StatsDisplay stats={playerData} /> */}
              {analysis && <AnalysisDisplay analysis={analysis} />}
              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2">Analyzing data...</p>
                </div>
              )}
              <Button
                onClick={analyseStats}
                disabled={loading}
              >
                {'Roast Again.'}
              </Button>
            </div>
          )}
          {!loading && !playerData && (
                <div className="space-y-6 pb-4 mt-4 text-sm">This is what will happen now:
                <ol className="list-decimal">
                  <li>You login so we can get your user ID (so it works for hidden accounts)</li>
                  <li>We then pull your statistics</li>
                  <li>A LLM (think ChatGPT like) will be downloaded to your computer. This can take long (we're talking, downloading Gb).</li>
                  <li>Then we feed the statistics through the LLM</li>
                  <li>The LLM will go through your stats, using your HW, hopefully your GPU (instead of the server)</li>
                  </ol>
                </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}