import React, {useState} from 'react';
import IssueForm from './components/IssueForm';
import VerifyForm from './components/VerifyForm';
import ListView from './components/ListView';

export default function App(){
  const [view, setView] = useState('home');
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Certificate Verification Portal</h1>
          <nav className="space-x-4">
            <button onClick={()=>setView('issue')} className="btn">Issue</button>
            <button onClick={()=>setView('verify')} className="btn">Verify</button>
            <button onClick={()=>setView('list')} className="btn">List</button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto">
        {view === 'home' && <div className="p-6 bg-white rounded shadow">Welcome to demo portal. Use the buttons to try features.</div>}
        {view === 'issue' && <IssueForm />}
        {view === 'verify' && <VerifyForm />}
        {view === 'list' && <ListView />}
      </main>
    </div>
  )
}
