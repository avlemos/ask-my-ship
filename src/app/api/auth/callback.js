export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { code } = req.query;
  
    try {
      // Exchange authorization code for access token
      const tokenResponse = await fetch(
        `https://api.worldofwarships.com/wot/auth/login/?application_id=${
          process.env.WARGAMING_APP_ID
        }&code=${code}`
      );
      
      const { access_token } = await tokenResponse.json();
      
      // Redirect back to frontend with access token
      res.redirect(`/?token=${access_token}`);
    } catch (error) {
      console.error('Error in auth callback:', error);
      res.redirect('/?error=auth_failed');
    }
  }