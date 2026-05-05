import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Logs, Lock, Mail, AlertCircle } from 'lucide-react';
import Spinner from '../components/ui/Spinner';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/');
    dispatch(reset());
  }, [user, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl mb-4">
            <Logs className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">TimberERP</h1>
          <p className="text-sm text-gray-500 font-medium">Wood Industry Management Suite</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sign In</h2>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 mb-6 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
                  placeholder="admin@timberERP.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] mt-2 shadow-lg shadow-black/10 flex items-center justify-center gap-2"
            >
              {loading ? <Spinner size="sm" className="border-t-white" /> : 'Log In to Workspace'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              Secured industrial access &bull; v1.0.4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
