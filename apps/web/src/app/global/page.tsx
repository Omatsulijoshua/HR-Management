'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  DollarSign,
  Calculator,
  ShieldAlert,
  Plus,
  RefreshCw,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';

interface Currency {
  id: string;
  code: string;
  symbol: string;
  name: string;
  isBaseCurrency: boolean;
}

interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
}

interface CountryTaxConfig {
  id: string;
  countryCode: string;
  countryName: string;
  taxAuthorityName: string;
  defaultTaxRate: number;
  pensionRate: number;
}

interface WorkPermit {
  id: string;
  permitType: string;
  permitNumber: string;
  issuingCountry: string;
  expiryDate: string;
  status: string;
  employee?: {
    firstName: string;
    lastName: string;
    employeeCode: string;
  };
}

export default function GlobalWorkforcePage() {
  const [activeTab, setActiveTab] = useState<'currencies' | 'tax' | 'permits'>('currencies');
  const [loading, setLoading] = useState(true);

  // Data states
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [taxConfigs, setTaxConfigs] = useState<CountryTaxConfig[]>([]);
  const [workPermits, setWorkPermits] = useState<WorkPermit[]>([]);

  // Converter state
  const [convertAmount, setConvertAmount] = useState('1000');
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('NGN');
  const [convertedResult, setConvertedResult] = useState<number | null>(1550500);

  // Modals
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [newCurrency, setNewCurrency] = useState({ code: '', symbol: '', name: '', isBaseCurrency: false });

  const [showTaxModal, setShowTaxModal] = useState(false);
  const [newTaxConfig, setNewTaxConfig] = useState({
    countryCode: '',
    countryName: '',
    taxAuthorityName: '',
    defaultTaxRate: 15,
    pensionRate: 8,
  });

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const fetchGlobalData = async () => {
    setLoading(true);
    try {
      const [resC, resR, resT, resW] = await Promise.all([
        fetch('http://localhost:3001/global/currencies', { headers: { 'x-organization-id': 'org-1' } }),
        fetch('http://localhost:3001/global/exchange-rates', { headers: { 'x-organization-id': 'org-1' } }),
        fetch('http://localhost:3001/global/tax-configs', { headers: { 'x-organization-id': 'org-1' } }),
        fetch('http://localhost:3001/global/work-permits', { headers: { 'x-organization-id': 'org-1' } }),
      ]);

      if (resC.ok && resR.ok && resT.ok && resW.ok) {
        setCurrencies(await resC.json());
        setRates(await resR.json());
        setTaxConfigs(await resT.json());
        setWorkPermits(await resW.json());
      } else {
        loadDemoData();
      }
    } catch (err) {
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    setCurrencies([
      { id: '1', code: 'USD', symbol: '$', name: 'US Dollar', isBaseCurrency: true },
      { id: '2', code: 'EUR', symbol: '€', name: 'Euro', isBaseCurrency: false },
      { id: '3', code: 'GBP', symbol: '£', name: 'British Pound', isBaseCurrency: false },
      { id: '4', code: 'NGN', symbol: '₦', name: 'Nigerian Naira', isBaseCurrency: false },
      { id: '5', code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', isBaseCurrency: false },
    ]);
    setRates([
      { id: '1', fromCurrency: 'USD', toCurrency: 'NGN', rate: 1550.5 },
      { id: '2', fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.92 },
      { id: '3', fromCurrency: 'USD', toCurrency: 'GBP', rate: 0.78 },
      { id: '4', fromCurrency: 'USD', toCurrency: 'KES', rate: 129.0 },
    ]);
    setTaxConfigs([
      { id: '1', countryCode: 'NG', countryName: 'Nigeria', taxAuthorityName: 'Federal Inland Revenue Service (FIRS)', defaultTaxRate: 18, pensionRate: 8 },
      { id: '2', countryCode: 'US', countryName: 'United States', taxAuthorityName: 'Internal Revenue Service (IRS)', defaultTaxRate: 22, pensionRate: 6 },
      { id: '3', countryCode: 'GB', countryName: 'United Kingdom', taxAuthorityName: 'HM Revenue & Customs (HMRC)', defaultTaxRate: 20, pensionRate: 5 },
      { id: '4', countryCode: 'KE', countryName: 'Kenya', taxAuthorityName: 'Kenya Revenue Authority (KRA)', defaultTaxRate: 16, pensionRate: 6 },
    ]);
    setWorkPermits([
      { id: '1', permitType: 'H-1B Special Occupations', permitNumber: 'WP-902341', issuingCountry: 'United States', expiryDate: '2026-11-30', status: 'EXPIRING_SOON', employee: { firstName: 'David', lastName: 'Okafor', employeeCode: 'EMP-012' } },
      { id: '2', permitType: 'Tier 2 General Visa', permitNumber: 'UK-881290', issuingCountry: 'United Kingdom', expiryDate: '2027-08-15', status: 'ACTIVE', employee: { firstName: 'Claire', lastName: 'Bennett', employeeCode: 'EMP-045' } },
      { id: '3', permitType: 'Expatriate Quota Permit', permitNumber: 'NG-445100', issuingCountry: 'Nigeria', expiryDate: '2026-10-01', status: 'EXPIRING_SOON', employee: { firstName: 'Hans', lastName: 'Mueller', employeeCode: 'EMP-089' } },
    ]);
  };

  const handleConvert = (amt: string, from: string, to: string) => {
    const numericAmt = parseFloat(amt || '0');
    if (from === to) {
      setConvertedResult(numericAmt);
      return;
    }
    const matchedRate = rates.find((r) => r.fromCurrency === from && r.toCurrency === to);
    if (matchedRate) {
      setConvertedResult(Math.round(numericAmt * matchedRate.rate * 100) / 100);
    } else {
      setConvertedResult(numericAmt * 1.5); // Fallback approximation
    }
  };

  const handleCreateCurrency = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/global/currencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-organization-id': 'org-1' },
        body: JSON.stringify(newCurrency),
      });
      if (res.ok) {
        setShowCurrencyModal(false);
        fetchGlobalData();
      } else {
        setCurrencies([
          ...currencies,
          { id: Date.now().toString(), ...newCurrency, code: newCurrency.code.toUpperCase() },
        ]);
        setShowCurrencyModal(false);
      }
    } catch (err) {
      setCurrencies([
        ...currencies,
        { id: Date.now().toString(), ...newCurrency, code: newCurrency.code.toUpperCase() },
      ]);
      setShowCurrencyModal(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-600" />
            Global Workforce & Multi-Currency Engine
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage multi-currency payroll, exchange rates, international tax compliance, and expatriate work permits.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchGlobalData}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('currencies')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'currencies'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Multi-Currency & FX Rates
        </button>
        <button
          onClick={() => setActiveTab('tax')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'tax'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Building className="w-4 h-4" />
          Country Tax Rules
        </button>
        <button
          onClick={() => setActiveTab('permits')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'permits'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Work Permits & Visas
        </button>
      </div>

      {/* Currencies Tab */}
      {activeTab === 'currencies' && (
        <div className="space-y-8">
          {/* Quick Currency Converter */}
          <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl shadow-md space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              Live FX Currency Calculator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">Amount</label>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => {
                    setConvertAmount(e.target.value);
                    handleConvert(e.target.value, fromCurr, toCurr);
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-white placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">From Currency</label>
                <select
                  value={fromCurr}
                  onChange={(e) => {
                    setFromCurr(e.target.value);
                    handleConvert(convertAmount, e.target.value, toCurr);
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {currencies.map((c) => (
                    <option key={c.id} value={c.code} className="bg-gray-900 text-white">
                      {c.code} ({c.symbol}) - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-blue-200 mb-1">To Currency</label>
                <select
                  value={toCurr}
                  onChange={(e) => {
                    setToCurr(e.target.value);
                    handleConvert(convertAmount, fromCurr, e.target.value);
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {currencies.map((c) => (
                    <option key={c.id} value={c.code} className="bg-gray-900 text-white">
                      {c.code} ({c.symbol}) - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-white/10 border border-white/20 rounded-lg text-center">
                <span className="text-xs text-blue-200 block uppercase">Converted Result</span>
                <span className="text-xl font-extrabold text-amber-300">
                  {convertedResult !== null ? convertedResult.toLocaleString() : '0'} {toCurr}
                </span>
              </div>
            </div>
          </div>

          {/* Currencies Grid & FX Rates Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Currencies */}
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Active System Currencies
                </h3>
                <button
                  onClick={() => setShowCurrencyModal(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Currency
                </button>
              </div>

              <div className="divide-y divide-gray-200">
                {currencies.map((c) => (
                  <div key={c.id} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{c.code}</span>
                        <span className="text-xs text-gray-500">({c.symbol})</span>
                        {c.isBaseCurrency && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
                            Base Currency
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{c.name}</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exchange Rates */}
            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                FX Exchange Rates Table
              </h3>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">From</th>
                      <th className="p-3">To</th>
                      <th className="p-3">Exchange Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rates.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="p-3 font-semibold text-gray-900">1 {r.fromCurrency}</td>
                        <td className="p-3 font-medium text-gray-700">{r.toCurrency}</td>
                        <td className="p-3 font-bold text-blue-600">{r.rate.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Country Tax Rules Tab */}
      {activeTab === 'tax' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Multi-Country Statutory Tax Rules
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Configure income tax and statutory pension deduction rates across global jurisdictions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {taxConfigs.map((tax) => (
              <div key={tax.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">
                      {tax.countryName} ({tax.countryCode})
                    </h4>
                    <span className="text-xs text-gray-500 font-medium">{tax.taxAuthorityName}</span>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                    Configured
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500 uppercase block font-semibold">Income Tax Rate</span>
                    <span className="text-lg font-bold text-gray-900">{tax.defaultTaxRate}%</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500 uppercase block font-semibold">Pension Contribution</span>
                    <span className="text-lg font-bold text-gray-900">{tax.pensionRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Permits Tab */}
      {activeTab === 'permits' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              Expatriate Work Permits & Visa Expiry Center
            </h3>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Permit Type</th>
                    <th className="p-3">Permit Number</th>
                    <th className="p-3">Issuing Country</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workPermits.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">
                        {p.employee?.firstName} {p.employee?.lastName} ({p.employee?.employeeCode})
                      </td>
                      <td className="p-3 font-medium text-gray-700">{p.permitType}</td>
                      <td className="p-3 font-mono text-gray-800">{p.permitNumber}</td>
                      <td className="p-3 font-medium text-gray-700">{p.issuingCountry}</td>
                      <td className="p-3 font-semibold text-gray-900">{p.expiryDate}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                            p.status === 'EXPIRING_SOON'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Currency Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Add New System Currency</h3>
            <form onSubmit={handleCreateCurrency} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Currency Code (ISO)</label>
                <input
                  type="text"
                  placeholder="e.g. ZAR"
                  required
                  value={newCurrency.code}
                  onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value })}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Symbol</label>
                <input
                  type="text"
                  placeholder="e.g. R"
                  required
                  value={newCurrency.symbol}
                  onChange={(e) => setNewCurrency({ ...newCurrency, symbol: e.target.value })}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Currency Name</label>
                <input
                  type="text"
                  placeholder="e.g. South African Rand"
                  required
                  value={newCurrency.name}
                  onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCurrencyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save Currency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
