import React, { useState, useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Download, Table, FileSpreadsheet, Eye, Info } from 'lucide-react';

const ReportsView = ({ data }) => {
  const { getBrutalBorderClass, getAccentBgClass, getShadowClass } = useSettings();
  const [selectedDataset, setSelectedDataset] = useState('statewise');

  // Preview data helper
  const previewRows = useMemo(() => {
    if (!data) return [];
    if (selectedDataset === 'statewise') {
      return data.states || [];
    } else if (selectedDataset === 'vaccination') {
      return data.vaccinationTimeline || [];
    } else if (selectedDataset === 'testing') {
      return data.testingTimeline || [];
    }
    return [];
  }, [data, selectedDataset]);

  // Convert array of objects to CSV string
  const convertToCSV = (arr) => {
    if (arr.length === 0) return '';
    const headers = Object.keys(arr[0]).join(',');
    const rows = arr.map((obj) =>
      Object.values(obj)
        .map((val) => (typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val))
        .join(',')
    );
    return [headers, ...rows].join('\n');
  };

  // Trigger file download
  const handleDownload = (datasetName) => {
    let sourceArr = [];
    if (datasetName === 'statewise') {
      sourceArr = data.states || [];
    } else if (datasetName === 'vaccination') {
      sourceArr = data.vaccinationTimeline || [];
    } else if (datasetName === 'testing') {
      sourceArr = data.testingTimeline || [];
    }

    if (sourceArr.length === 0) return;

    const csvContent = convertToCSV(sourceArr);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `covid_india_${datasetName}_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Export Action Center */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statewise Card */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4 shadow-brutalist-border hover:shadow-brutalist-orange transition-brutal">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-md font-bold font-mono text-white uppercase">STATEWISE INDEX</h4>
              <span className="text-[10px] text-brand-muted font-mono uppercase">LATEST STATS BY STATE</span>
            </div>
            <div className="p-2 bg-brand-primary/10 rounded-lg border border-brand-primary">
              <FileSpreadsheet className="w-5 h-5 text-brand-primary" />
            </div>
          </div>
          <p className="text-xs text-brand-muted font-mono leading-relaxed">
            Exports cumulative figures including confirmed, active, deaths, recoveries, and mortality indexes for all regions.
          </p>
          <button
            onClick={() => handleDownload('statewise')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-black text-xs font-mono font-bold uppercase transition-brutal shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getAccentBgClass()} text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}
          >
            <Download className="w-4 h-4" />
            DOWNLOAD CSV REGISTER
          </button>
        </div>

        {/* Vaccination timeline */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4 shadow-brutalist-border hover:shadow-brutalist-yellow transition-brutal">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-md font-bold font-mono text-white uppercase">VACCINE TIMELINE</h4>
              <span className="text-[10px] text-brand-muted font-mono uppercase">PROGRESS TIMELINE RECORD</span>
            </div>
            <div className="p-2 bg-brand-secondary/10 rounded-lg border border-brand-secondary">
              <FileSpreadsheet className="w-5 h-5 text-brand-secondary" />
            </div>
          </div>
          <p className="text-xs text-brand-muted font-mono leading-relaxed">
            Daily logs of national doses, manufacturer breakdowns (Covaxin, Covishield, Sputnik), and gender demographics.
          </p>
          <button
            onClick={() => handleDownload('vaccination')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-black text-xs font-mono font-bold uppercase transition-brutal shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-brand-secondary text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}
          >
            <Download className="w-4 h-4" />
            DOWNLOAD DOSES JOURNAL
          </button>
        </div>

        {/* Testing timeline */}
        <div className="bg-brand-card p-6 rounded-brutalist border-2 border-brand-border space-y-4 shadow-brutalist-border hover:shadow-brutalist-orange transition-brutal">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-md font-bold font-mono text-white uppercase">TESTING TIMELINE</h4>
              <span className="text-[10px] text-brand-muted font-mono uppercase">DIAGNOSTIC SURVEILLANCE RECORDS</span>
            </div>
            <div className="p-2 bg-brand-primary/10 rounded-lg border border-brand-primary">
              <FileSpreadsheet className="w-5 h-5 text-brand-primary" />
            </div>
          </div>
          <p className="text-xs text-brand-muted font-mono leading-relaxed">
            Tracks total daily testing, RT-PCR vs Rapid Antigen test volumes, positivity indices, and ICU support counts.
          </p>
          <button
            onClick={() => handleDownload('testing')}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-black text-xs font-mono font-bold uppercase transition-brutal shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getAccentBgClass()} text-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}
          >
            <Download className="w-4 h-4" />
            DOWNLOAD TESTS REGISTRY
          </button>
        </div>
      </div>

      {/* Dataset Preview Console */}
      <div className="bg-brand-card rounded-brutalist border-2 border-brand-border overflow-hidden">
        <div className="p-6 border-b border-brand-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-card">
          <div className="flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-brand-secondary" />
            <div>
              <h3 className="text-lg font-bold font-condensed tracking-tight uppercase text-white leading-none mb-1">
                Local Registry Preview Console
              </h3>
              <p className="text-xs text-brand-muted">Browsing first 10 rows of selected cached dataset</p>
            </div>
          </div>

          <div className="flex bg-brand-bg rounded-lg border border-brand-border p-1">
            {['statewise', 'vaccination', 'testing'].map((db) => (
              <button
                key={db}
                onClick={() => setSelectedDataset(db)}
                className={`px-3 py-1.5 text-[10px] font-mono rounded uppercase transition-brutal ${
                  selectedDataset === db ? 'bg-brand-primary text-black font-bold' : 'text-brand-muted hover:text-white'
                }`}
              >
                {db}
              </button>
            ))}
          </div>
        </div>

        {/* Table Preview container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="bg-brand-bg border-b border-brand-border text-brand-muted">
                {previewRows.length > 0 &&
                  Object.keys(previewRows[0]).slice(0, 7).map((key) => (
                    <th key={key} className="p-3 uppercase">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-white">
              {previewRows.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="hover:bg-brand-bg/40">
                  {Object.values(row).slice(0, 7).map((val, colIdx) => (
                    <td key={colIdx} className="p-3 truncate max-w-[200px]">
                      {typeof val === 'number'
                        ? val.toLocaleString()
                        : typeof val === 'string'
                        ? val.toUpperCase()
                        : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-brand-bg/50 border-t border-brand-border flex items-center gap-3 text-xs text-brand-muted font-mono leading-relaxed">
          <Info className="w-4 h-4 text-brand-secondary shrink-0" />
          Data downloaded matches the exact internal memory representations stored in the client cache.
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
