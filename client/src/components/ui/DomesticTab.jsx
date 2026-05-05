import React from 'react';
import Card from './Card';
import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import { Truck, Package, MapPin, Navigation } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, trend }) => {
  const isPositive = trend > 0;
  
  return (
    <div className="stat-card p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="stat-card-label uppercase text-[10px] font-bold tracking-wider">{label}</p>
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xl font-extrabold stat-card-value leading-tight">{value}</h2>
      </div>
      {sub && <p className="text-xs stat-card-sub mt-1">{sub}</p>}
    </div>
  );
};

const DomesticTab = ({ domesticStats = {}, domesticOrders = [] }) => {
  const statItems = [
    { 
      icon: Package,
      label: 'Total Orders Today', 
      value: domesticStats.totalOrdersToday || 0, 
      sub: 'Active orders' 
    },
    { 
      icon: Truck,
      label: 'Pending Dispatch', 
      value: domesticStats.pendingDispatch || 0, 
      sub: 'Ready for shipment' 
    },
    { 
      icon: Navigation,
      label: 'Out for Delivery', 
      value: domesticStats.outForDelivery || 0, 
      sub: 'In route' 
    },
    { 
      icon: MapPin,
      label: 'Delivered', 
      value: domesticStats.delivered || 0, 
      sub: 'Completed today' 
    },
  ];

  const mockDeliveryStatus = {
    availableVehicles: domesticStats.availableVehicles || 12,
    onRoute: domesticStats.onRoute || 8,
    completedDeliveries: domesticStats.completedDeliveries || 34,
  };

  return (
    <div className="animate-fadeIn">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statItems.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Orders Table */}
        <div className="lg:col-span-2">
          <Card title="Domestic Orders" subtitle="Real-time tracking of local deliveries">
            <div className="overflow-x-auto">
              <DataTable 
                headers={['Order ID', 'Customer', 'Location', 'Vehicle No', 'Driver', 'Delivery Date', 'Status']}
                data={domesticOrders}
                renderRow={(order) => (
                  <>
                    <td className="px-5 py-4 text-[13px] font-bold text-gray-400">{order.orderId}</td>
                    <td className="px-5 py-4 text-[13px] font-bold text-gray-900">{order.customer}</td>
                    <td className="px-5 py-4 text-[13px] text-gray-700">{order.location}</td>
                    <td className="px-5 py-4 text-[13px] font-mono text-[11px] font-bold text-gray-400 uppercase">{order.vehicleNo}</td>
                    <td className="px-5 py-4 text-[13px] text-gray-600">{order.driver}</td>
                    <td className="px-5 py-4 text-[13px] font-medium text-gray-600">{order.deliveryDate}</td>
                    <td className="px-5 py-4 text-[13px]"><StatusBadge status={order.status} /></td>
                  </>
                )}
              />
            </div>
          </Card>
        </div>

        {/* Delivery Status Sidebar */}
        <div className="lg:col-span-1">
          <Card title="Delivery Status" subtitle="Fleet & performance overview">
            <div className="space-y-4 mt-4">
              {/* Available Vehicles */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl hover:border-blue-200 hover:bg-blue-100/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-bold text-blue-900 uppercase tracking-wider">Available Vehicles</p>
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-2xl font-extrabold text-blue-600">{mockDeliveryStatus.availableVehicles}</p>
                <p className="text-[10px] text-blue-600/60 font-medium mt-1">Ready for dispatch</p>
              </div>

              {/* On Route */}
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl hover:border-amber-200 hover:bg-amber-100/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-bold text-amber-900 uppercase tracking-wider">On Route</p>
                  <Navigation className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-2xl font-extrabold text-amber-600">{mockDeliveryStatus.onRoute}</p>
                <p className="text-[10px] text-amber-600/60 font-medium mt-1">Active deliveries</p>
              </div>

              {/* Completed Deliveries */}
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl hover:border-green-200 hover:bg-green-100/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-bold text-green-900 uppercase tracking-wider">Completed</p>
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-2xl font-extrabold text-green-600">{mockDeliveryStatus.completedDeliveries}</p>
                <p className="text-[10px] text-green-600/60 font-medium mt-1">Delivered today</p>
              </div>
            </div>

            <button className="w-full mt-6 py-3 border border-dashed border-gray-300 rounded-xl text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:border-black hover:text-black transition-all">
              View Fleet Analytics
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DomesticTab;
