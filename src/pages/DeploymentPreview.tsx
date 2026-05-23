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
  const [htmlContent, setHtmlContent] = useState('');

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

        // If it's not active, render a placeholder downtime screen
        if (data.status !== 'ACTIVE') {
          setHtmlContent(`
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 50px; color: #64748B;">
              <h2 style="color: #0F172A; font-size: 24px; margin-bottom: 12px;">Service Unavailable</h2>
              <p>This service is currently marked as <strong>${data.status}</strong>. Please deploy it from the Azze dashboard to bring it online.</p>
            </div>
          `);
          setStatus('success');
          return;
        }

        // Simulate fetching compiled output from DB. We generate basic HTML representation.
        const mockHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${data.name} - Deployed via Azze</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px; background: #f8fafc; color: #0f172a; }
              .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; }
              h1 { color: #c37a4c; margin-top: 0; }
              .badge { display: inline-block; background: #10b981; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-bottom: 24px; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748B; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <span class="badge">Live & Operational</span>
              <h1>${data.name}</h1>
              <p>This is a live deployment served securely by the <strong>Azze Platform</strong>.</p>
              <pre style="background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto;"><code>
{
  "status": 200,
  "service": "${data.name}",
  "message": "API endpoint successfully reached",
  "repository": "${data.github_url}",
  "timestamp": "${new Date().toISOString()}"
}
              </code></pre>
              <div class="footer">
                Powered by Arca
              </div>
            </div>
          </body>
          </html>
        `;
        
        setHtmlContent(mockHtml);
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
      title={`Deployment - ${slug}`}
      srcDoc={htmlContent}
      style={{ width: '100%', height: '100vh', border: 'none', background: '#f8fafc' }}
    />
  );
}