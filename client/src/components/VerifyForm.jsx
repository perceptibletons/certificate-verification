import React, {useState} from 'react';
import axios from 'axios';

export default function VerifyForm(){
  const [certID, setCertID] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const submit = async (e)=>{
    e.preventDefault();
    let hashHex = '';
    if(file){
      const buf = await file.arrayBuffer();
      const h = await crypto.subtle.digest('SHA-256', buf);
      const arr = Array.from(new Uint8Array(h));
      hashHex = arr.map(b => b.toString(16).padStart(2,'0')).join('');
    }
    try{
      const r = await axios.post('/api/verify', { certID, hashHex });
      setResult(r.data.message);
    }catch(err){
      setResult(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Verify Certificate</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Certificate ID" value={certID} onChange={e=>setCertID(e.target.value)} />
        <input type="file" onChange={e=>setFile(e.target.files[0])} className="block" />
        <button className="btn" type="submit">Verify</button>
      </form>
      <div className="mt-3 text-sm">{result}</div>
    </div>
  )
}
