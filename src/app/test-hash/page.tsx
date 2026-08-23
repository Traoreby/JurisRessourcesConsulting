"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TestHashPage() {
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const runTest = async () => {
      const logs: string[] = [];
      logs.push(`Initial Hash: ${window.location.hash}`);
      
      const supabase = createClient();
      logs.push(`Client created`);
      
      // Attempt to get session
      const { data, error } = await supabase.auth.getSession();
      logs.push(`getSession error: ${error?.message || 'none'}`);
      logs.push(`Session exists: ${!!data.session}`);
      if (data.session) {
         logs.push(`User ID: ${data.session.user.id}`);
      }

      setLog(logs);
    };
    runTest();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Test Hash Parsing</h1>
      <pre className="bg-slate-100 p-4 rounded text-sm whitespace-pre-wrap">
        {log.join('\n')}
      </pre>
    </div>
  );
}
