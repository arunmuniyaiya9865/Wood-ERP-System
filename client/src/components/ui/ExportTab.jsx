import React from 'react';
import Card from './Card';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import StatGrid from './StatGrid';
import { FileText, Download, Box } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const ExportTab = ({ shipments = [], documents = [], stats = {} }) => {
  const statItems = [
    { label: 'In Transit', value: stats.inTransit || 0, trend: 1, sub: 'Shipments on water' },
    { label: 'Pending Compliance', value: stats.pendingDocs || 0, trend: -2, sub: 'Needs documentation' },
    { label: 'Delivery Success', value: `${stats.deliverySuccess || 0}%`, sub: 'YTD Aggregated' },
    { label: 'Active Vessels', value: stats.activeVessels || 0, sub: 'Global fleet monitor' },
  ];

  return (
    <div className="animate-fadeIn">
      <StatGrid stats={statItems} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Shipments Tracker */}
        <div className="lg:col-span-2">
          <Card title="Live Cargo Tracking" subtitle="Real-time status of international shipments">
            <div className="overflow-x-auto">
              <DataTable 
                headers={['ID', 'Destination', 'Customer', 'ETA', 'Vessel', 'Operational Status']}
                data={shipments}
                renderRow={(s) => (
                  <>
                    <td className="px-5 py-4 text-[13px] font-bold text-gray-400">{s.shipmentId}</td>
                    <td className="px-5 py-4 text-[13px] font-bold text-gray-900">{s.destination}</td>
                    <td className="px-5 py-4 text-[13px] text-gray-700">{s.customer?.name}</td>
                    <td className="px-5 py-4 text-[13px] font-medium text-gray-600">{formatDate(s.eta)}</td>
                    <td className="px-5 py-4 text-[13px] font-mono text-[11px] font-bold text-gray-400 uppercase">{s.vessel}</td>
                    <td className="px-5 py-4 text-[13px]"><StatusBadge status={s.status} /></td>
                  </>
                )}
              />
            </div>
          </Card>
        </div>

        {/* Compliance Sidebar */}
        <div className="lg:col-span-1">
          <Card title="Compliance Terminal" subtitle="Required export & customs docs">
            <div className="space-y-4 mt-4">
              {documents.map((doc) => (
                <div key={doc._id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl group hover:border-black/20 hover:bg-white transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                      <FileText className="w-5 h-5 text-gray-900" />
                    </div>
                    <StatusBadge status={doc.status}>{doc.status}</StatusBadge>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-gray-900 leading-tight mb-1">{doc.type}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Ref: {doc.docId}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500">{doc.shipment?.shipmentId || 'G-REF-001'}</span>
                    <button className="p-1 text-gray-400 hover:text-black transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {documents.length === 0 && <p className="py-10 text-center text-gray-400 text-sm italic">Compliance list current</p>}
            </div>
            <button className="w-full mt-6 py-3 border border-dashed border-gray-300 rounded-xl text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:border-black hover:text-black transition-all">Generate New Document</button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExportTab;
