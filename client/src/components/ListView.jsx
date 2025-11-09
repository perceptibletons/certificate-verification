import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function ListView(){
  const [list, setList] = useState({});
  useEffect(()=>{ axios.get('/api/list').then(r=>setList(r.data.certificates)).catch(()=>{}); },[]);
  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">All Certificates (Demo)</h2>
      <table className="w-full text-sm">
        <thead><tr><th>ID</th><th>Student</th><th>Issuer</th><th>Program</th><th>Status</th></tr></thead>
        <tbody>
          {Object.values(list).map(c=>(
            <tr key={c.certID} className="border-t">
              <td className="py-2">{c.certID}</td>
              <td>{c.studentName}</td>
              <td>{c.issuer}</td>
              <td>{c.program}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
