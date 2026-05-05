import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuppliers, fetchPurchaseOrders } from '../features/procurement/procurementSlice';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import StatGrid from '../components/ui/StatGrid';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Plus, Filter } from 'lucide-react';

const Procurement = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [showPOModal, setShowPOModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const dispatch = useDispatch();
  const { suppliers, purchaseOrders, loading } = useSelector(state => state.procurement);

  const [poForm, setPOForm] = useState({
    supplier: '',
    species: '',
    volume: '',
    totalAmount: '',
    expectedDate: '',
    status: 'pending'
  });

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    country: '',
    species: '',
    status: 'active',
    totalOrders: 0,
    ytdValue: 0
  });

  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  const handleCreatePO = () => {
    const newPO = {
      ...poForm,
      poId: `PO-${Date.now()}`,
      supplier: { name: poForm.supplier }
    };

    dispatch({ type: 'procurement/addPurchaseOrder', payload: newPO });
    setShowPOModal(false);
  };

  const handleCreateSupplier = () => {
    const newSupplier = {
      ...supplierForm,
      supplierId: `SUP-${Date.now()}`,
      species: supplierForm.species.split(',')
    };

    dispatch({ type: 'procurement/addSupplier', payload: newSupplier });
    setShowSupplierModal(false);
  };

  const statItems = [
    { label: 'Active Suppliers', value: suppliers.length },
    { label: 'Pending POs', value: purchaseOrders.filter(p => p.status === 'pending').length },
    { label: 'YTD Spending', value: formatCurrency(345200) },
    { label: 'Avg Lead Time', value: '14 Days' },
  ];

  return (
    <div className="w-full">

      <PageHeader
        title="Procurement & Sourcing"
        subtitle="Manage timber suppliers and raw material acquisition"
        actions={
          <>
            <button className="btn-glass flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {activeTab === 'orders' ? (
              <button onClick={() => setShowPOModal(true)} className="btn-gradient flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create PO
              </button>
            ) : (
              <button onClick={() => setShowSupplierModal(true)} className="btn-gradient flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Supplier
              </button>
            )}
          </>
        }
      />

      <StatGrid stats={statItems} />

      <Card className="p-0 overflow-hidden glass-card">
        {/* Tabs */}
        <div className="flex border-b border-white/20 px-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`tab-btn ${activeTab === 'orders' && 'active-tab'}`}
          >
            Purchase Orders
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`tab-btn ${activeTab === 'suppliers' && 'active-tab'}`}
          >
            Suppliers
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><Spinner /></div>
        ) : activeTab === 'orders' ? (
          <DataTable
            headers={['PO ID', 'Supplier', 'Species', 'Volume', 'Total', 'Date', 'Status']}
            data={purchaseOrders}
            renderRow={(po) => (
              <>
                <td className="td">{po.poId}</td>
                <td className="td">{po.supplier?.name}</td>
                <td className="td">{po.species}</td>
                <td className="td">{po.volume}</td>
                <td className="td">{formatCurrency(po.totalAmount)}</td>
                <td className="td">{formatDate(po.expectedDate)}</td>
                <td className="td"><Badge status={po.status} /></td>
              </>
            )}
          />
        ) : (
          <DataTable
            headers={['ID', 'Name', 'Country', 'Species', 'Orders', 'YTD', 'Status']}
            data={suppliers}
            renderRow={(s) => (
              <>
                <td className="td">{s.supplierId}</td>
                <td className="td">{s.name}</td>
                <td className="td">{s.country}</td>
                <td className="td">{s.species?.join(', ')}</td>
                <td className="td">{s.totalOrders}</td>
                <td className="td">{formatCurrency(s.ytdValue)}</td>
                <td className="td"><Badge status={s.status} /></td>
              </>
            )}
          />
        )}
      </Card>

      {/* PO MODAL */}
      <Modal isOpen={showPOModal} onClose={() => setShowPOModal(false)} title="Create PO">
        <div className="space-y-3">
          <input className="input-glass" placeholder="Supplier" onChange={(e) => setPOForm({...poForm, supplier: e.target.value})}/>
          <input className="input-glass" placeholder="Species" onChange={(e) => setPOForm({...poForm, species: e.target.value})}/>
          <input className="input-glass" placeholder="Volume" onChange={(e) => setPOForm({...poForm, volume: e.target.value})}/>
          <input className="input-glass" placeholder="Total Amount" onChange={(e) => setPOForm({...poForm, totalAmount: e.target.value})}/>
          <input type="date" className="input-glass" onChange={(e) => setPOForm({...poForm, expectedDate: e.target.value})}/>
          <button onClick={handleCreatePO} className="btn-gradient w-full">Save</button>
        </div>
      </Modal>

      {/* SUPPLIER MODAL */}
      <Modal isOpen={showSupplierModal} onClose={() => setShowSupplierModal(false)} title="Add Supplier">
        <div className="space-y-3">
          <input className="input-glass" placeholder="Name" onChange={(e) => setSupplierForm({...supplierForm, name: e.target.value})}/>
          <input className="input-glass" placeholder="Country" onChange={(e) => setSupplierForm({...supplierForm, country: e.target.value})}/>
          <input className="input-glass" placeholder="Species (comma)" onChange={(e) => setSupplierForm({...supplierForm, species: e.target.value})}/>
          <button onClick={handleCreateSupplier} className="btn-gradient w-full">Save</button>
        </div>
      </Modal>

    </div>
  );
};

export default Procurement;