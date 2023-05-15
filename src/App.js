import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';

function App() {
  const [fileUrl, setFileUrl] = useState('');
  const [histogramData, setHistogramData] = useState([]);

  const fetchHistogramData = async () => {
    try {
      const response = await axios.get(fileUrl);
      const words = response.data.split(/\s+/);
      const frequencyMap = new Map();
      words.forEach((word) => {
        if (!frequencyMap.has(word)) {
          frequencyMap.set(word, 0);
        }
        frequencyMap.set(word, frequencyMap.get(word) + 1);
      });
      const histogramData = Array.from(frequencyMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word, frequency]) => ({
          word,
          frequency,
        }));
      setHistogramData(histogramData);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      histogramData.map(({ word, frequency }) => `${word},${frequency}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "histogram_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',backgroundColor: 'cyan'}}>
      <label htmlFor="file-url" style={{fontSize: 20, fontWeight: 'bold'}}>File URL:</label>
      <input
        id="file-url"
        type="text"
        value={fileUrl}
        onChange={(event) => setFileUrl(event.target.value)}
        style={{padding: 10, margin: '0 0 20px', border: '1px solid #ccc', borderRadius: 5, width: '100%', maxWidth: 400}}
      />
      <button onClick={fetchHistogramData} style={{padding: 10, backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer'}}>Submit</button>
      {histogramData.length > 0 && (
        <>
          <BarChart width={1000} height={500} data={histogramData} style={{marginTop: 50}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="frequency" fill="#007bff" />
          </BarChart>
          <button onClick={downloadCsv} style={{padding: 10, backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', marginTop: 20}}>Export</button>
        </>
      )}
    </div>
    
  );
}

export default App;
