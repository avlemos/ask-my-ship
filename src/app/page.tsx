"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MLCEngine } from "@mlc-ai/web-llm";
import LoadingProgress from '@/components/LoadingProgress';
import StatsDisplay from '@/components/StatsDisplay';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import { PlayerStats } from '@/lib/types';
import { analyzePlayerStats } from '@/lib/utils';

export default function Home() {
  const [playerData, setPlayerData] = useState<PlayerStats | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
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

  // Initialize WebLLM
  useEffect(() => {
    async function initWebLLM() {
      try {

        const initProgressCallback = (report: any) => {
          console.log("Init progress:", report);
          setLoadingProgress({
            progress: report.progress || 0,
            total: report.total || 0,
            stage: report.text || 'Loading model...'
          });
        };        
        setModelLoading(true);
        //const engineInstance = new MLCEngine({ initProgressCallback });
        //await engineInstance.reload("Hermes-2-Pro-Mistral-7B-q4f16_1-MLC");
        //setModel(engineInstance);
        setModelLoading(false);
      } catch (err) {
        setError('Failed to load WebLLM model');
        console.error(err);
        setModelLoading(false);
      }
    }
    initWebLLM();
  }, []);

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

  const handleWargamingAuth = () => {

    if (!process.env.NEXT_PUBLIC_REDIRECT_URI || !process.env.NEXT_PUBLIC_WARGAMING_APP_ID) {
      throw new Error('Missing environment variables');
    }

    try {
      setLoading(true);
      const openidUrl = 'https://api.worldoftanks.eu/wot/auth/login/';
      
      const params = new URLSearchParams({
        application_id: process.env.NEXT_PUBLIC_WARGAMING_APP_ID || '',
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI || ''
      });

      window.location.href = `${openidUrl}?${params.toString()}`;
    } catch (err) {
      setError('Authentication failed');
      console.error(err);
      setLoading(false);
    }
  };

  const fetchPlayerStats = async (token: string, accountId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/fetch-stats?token=${token}&account_id=${accountId}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setPlayerData(data);
      const engineInstance = new MLCEngine({ });
      await engineInstance.reload("Hermes-2-Pro-Mistral-7B-q4f16_1-MLC");
      
      //if (model) {
        const analysis = await analyzePlayerStats(engineInstance, data);
        console.log('Analysis:', analysis);
        setAnalysis(analysis);
      //}
    } catch (err) {
      setError('Failed to fetch player stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">World of Warships Stats Analyzer</h1>
        </CardHeader>
        <CardContent>
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
            <div className="space-y-6">
              <StatsDisplay stats={playerData} />
              {analysis && <AnalysisDisplay analysis={analysis} />}
              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2">Analyzing data...</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}