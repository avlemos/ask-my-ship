export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { access_token } = req.query;
  
    try {
      // Fetch player stats from Wargaming API
      const response = await fetch(
        `https://api.worldofwarships.com/wows/account/info/?application_id=${
          process.env.WARGAMING_APP_ID
        }&access_token=${access_token}`
      );
      
      const data = await response.json();
      
      // Send data to analysis service
      const analysisResponse = await fetch('YOUR_ANALYSIS_SERVICE_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const analysis = await analysisResponse.json();
      
      return res.status(200).json({
        playerData: data,
        analysis,
      });
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return res.status(500).json({ message: 'Failed to fetch player stats' });
    }
  }