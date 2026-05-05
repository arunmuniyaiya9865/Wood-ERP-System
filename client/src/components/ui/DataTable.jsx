import React from 'react';

const DataTable = ({ headers, data, renderRow }) => {
  return (
    <div className="w-full rounded-2xl border border-white/45 shadow-[inset_0_0_0_1px_rgba(156,169,203,0.25)] bg-white/30 backdrop-blur-sm">

      {/* HEADER (fixed) */}
      <div className="overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/35 border-b border-white/40 backdrop-blur-sm">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-5 py-3 text-[10px] font-bold text-[#64748b] uppercase tracking-widest">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-left">
          <tbody className="divide-y divide-white/30">
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-white/35 transition-colors">
                {renderRow ? renderRow(row) : (
                  Array.isArray(row) ? row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-5 py-4 text-[13px] text-[#334155] whitespace-nowrap">
                      {cell}
                    </td>
                  )) : null
                )}
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-5 py-10 text-center text-gray-400 text-sm">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default DataTable;