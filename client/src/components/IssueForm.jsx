import React, {useState} from 'react';
import axios from 'axios';

export default function IssueForm(){
  const [form, setForm] = useState({certID:'', issuer:'', studentName:'', program:'', issueDate:'', file:null});
  const [msg, setMsg] = useState('');

  const handleFile = (e)=> setForm({...form, file: e.target.files[0]});
  const submit = async (e)=>{
    e.preventDefault();
    if(!form.certID) return setMsg('certID required');
    // compute SHA-256 hash of file
    let hashHex = '';
    if(form.file){
      const buf = await form.file.arrayBuffer();
      const h = await crypto.subtle.digest('SHA-256', buf);
      const arr = Array.from(new Uint8Array(h));
      hashHex = arr.map(b => b.toString(16).padStart(2,'0')).join('');
    }
    const payload = {...form, fileHash: hashHex};
    try{
      const r = await axios.post('/api/issue', payload);
      setMsg('Issued: ' + JSON.stringify(r.data.cert.certID));
    }catch(err){
      setMsg(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Issue Certificate</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Certificate ID" value={form.certID} onChange={e=>setForm({...form, certID:e.target.value})} />
        <input className="input" placeholder="Issuer" value={form.issuer} onChange={e=>setForm({...form, issuer:e.target.value})} />
        <input className="input" placeholder="Student Name" value={form.studentName} onChange={e=>setForm({...form, studentName:e.target.value})} />
        <input className="input" placeholder="Program" value={form.program} onChange={e=>setForm({...form, program:e.target.value})} />
        <input className="input" placeholder="Issue Date (YYYY-MM-DD)" value={form.issueDate} onChange={e=>setForm({...form, issueDate:e.target.value})} />
        <input type="file" onChange={handleFile} className="block"/>
        <button className="btn" type="submit">Issue</button>
      </form>
      <div className="mt-3 text-sm">{msg}</div>
    </div>
  )
}
