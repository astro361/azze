/**
 * Azze Platform - Deployment Preview View
 * Parent Company: Arca
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function DeploymentPreview() {
  const { slug } = useParams<{ slug: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [liveUrl, setLiveUrl] = useState('');

  useEffect(() => {
    const fetchDeployment = async () => {
      try {
        setStatus('loading');
        // Ensure we have an active session context to avoid RLS block
        await supabase.auth.getSession();
        
        // ALIGN FETCH QUERY: Exact match using 'id' (which is our slug parameter)
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', slug || '')
          .limit(1)
          .maybeSingle();

        if (error || !data) {
          setStatus('error');
          return;
        }

        // If it's not active, render a placeholder downtime screen instead of the iframe
        if (data.status !== 'ACTIVE' || !data.deployed_url) {
          // Serve a fallback data URI html blob if not deployed successfully yet
          setLiveUrl('data:text/html,' + encodeURIComponent(`
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 50px; color: #64748B; background: #f8fafc; height: 100vh;">
              <h2 style="color: #0F172A; font-size: 24px; margin-bottom: 12px;">Service Unavailable</h2>
              <p>This service is currently marked as <strong>${data.status}</strong> or has no valid deployment URL.</p>
            </div>
          `));
          setStatus('success');
          return;
        }

        // It's active and has a deployed_url saved from our Vercel API! Set it.
        const urlToLoad = data.deployed_url.startsWith('http') ? data.deployed_url : `https://${data.deployed_url}`;
        setLiveUrl(urlToLoad);
        setStatus('success');
      } catch (e) {
        setStatus('error');
      }
    };

    if (slug) {
      fetchDeployment();
    } else {
      setStatus('error');
    }
  }, [slug]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#c37a4c]" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex h-screen items-center justify-center flex-col text-slate-500 bg-slate-50">
        <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Deployment Not Found</h2>
        <p>Could not locate the requested service deployment or it has been removed.</p>
      </div>
    );
  }

  return (
    <iframe 
      title={`Live Deployment - ${slug}`}
      src={liveUrl}
      className="w-full h-screen border-none bg-slate-50"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  );
}