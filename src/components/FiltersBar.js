import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function FiltersBar({ start, end, setStart, setEnd, category, setCategory, categories=[] }) {
  return (
    <div style={{display:'flex', gap:12, alignItems:'center', flexWrap:'wrap', marginBottom:16}}>
      <div>
        <div style={{fontSize:12}}>Start</div>
        <DatePicker selected={start} onChange={d => setStart(d)} />
      </div>
      <div>
        <div style={{fontSize:12}}>End</div>
        <DatePicker selected={end} onChange={d => setEnd(d)} />
      </div>
      <div>
        <div style={{fontSize:12}}>Category</div>
        <select value={category || ""} onChange={e => setCategory(e.target.value)}>
          <option value="">All</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
}

