import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Building2,
  DollarSign,
  Palette,
  Bell,
  ShieldCheck,
  UserCog,
  Save,
  KeyRound,
  Download,
  Database,
  Plus,
  Loader2,
  Sun,
  Moon,
  Check,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
  getSettings,
  updateCompanyProfile,
  updateCurrencyTax,
  updateAppearance,
  updateNotifications,
  changePassword,
  toggleTwoFactor,
  updateRoles,
  exportInventoryCSV,
  triggerBackup,
} from "../api/settingsApi";

const NAV_ITEMS = [
  { key: "company", label: "Company Profile", icon: Building2 },
  { key: "currency", label: "Currency & Tax", icon: DollarSign },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: ShieldCheck },
  { key: "roles", label: "Roles & Permissions", icon: UserCog },
];

const ACCENT_COLORS = ["#5B4CF7", "#8B5CF6", "#3B82F6", "#10B981", "#F97316", "#EC4899"];

const PERMISSION_KEYS = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "export", label: "Export" },
  { key: "manageUsers", label: "Manage Users" },
];

/* ------------------------------- Small UI bits ------------------------------- */

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold tracking-wide text-(--text-gray) uppercase mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const inputClasses =
  "w-full bg-(--bg-dark) border border-(--border-color) rounded-xl px-4 py-2.5 text-sm text-(--text-white) placeholder-slate-500 focus:outline-none focus:border-(--primary-purple) transition-all";

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
      checked ? "bg-(--primary-purple)" : "bg-slate-600/40"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const SaveButton = ({ onClick, saving, label = "Save Changes" }) => (
  <button
    onClick={onClick}
    disabled={saving}
    className="flex items-center gap-2 bg-(--primary-purple) hover:bg-(--hover-purple) text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-all disabled:opacity-60 cursor-pointer"
  >
    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
    {label}
  </button>
);

const SectionCard = ({ title, children, className = "" }) => (
  <div className={`bg-(--bg-card) border border-(--border-color) rounded-2xl p-6 shadow-sm ${className}`}>
    <h2 className="text-lg font-bold text-(--text-white) mb-5">{title}</h2>
    {children}
  </div>
);

/* --------------------------------- Main page --------------------------------- */

const Settings = () => {
  const { darkMode, setTheme, accentColor, setAccentColor } = useTheme();

  const [activeTab, setActiveTab] = useState("company");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);

  const [companyForm, setCompanyForm] = useState(null);
  const [currencyForm, setCurrencyForm] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [rolesDraft, setRolesDraft] = useState([]);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings(data);
      setCompanyForm(data.companyProfile);
      setCurrencyForm(data.currencyTax);
      setRolesDraft(data.roles);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  /* ---------------- Company Profile ---------------- */
  const saveCompanyProfile = async () => {
    try {
      setSaving(true);
      const updated = await updateCompanyProfile(companyForm);
      setSettings(updated);
      toast.success("Company profile saved");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- Currency & Tax ---------------- */
  const saveCurrencyTax = async () => {
    try {
      setSaving(true);
      const updated = await updateCurrencyTax(currencyForm);
      setSettings(updated);
      toast.success("Currency & tax settings saved");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- Appearance (instant apply + persist) ---------------- */
  const handleThemeSelect = async (mode) => {
    setTheme(mode);
    try {
      await updateAppearance({ theme: mode, accentColor });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAccentSelect = async (color) => {
    setAccentColor(color);
    try {
      await updateAppearance({ theme: darkMode ? "dark" : "light", accentColor: color });
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ---------------- Notifications (instant toggle) ---------------- */
  const handleNotificationToggle = async (key) => {
    const next = { ...settings.notifications, [key]: !settings.notifications[key] };
    setSettings((prev) => ({ ...prev, notifications: next }));
    try {
      await updateNotifications(next);
    } catch (error) {
      toast.error(error.message);
      setSettings((prev) => ({ ...prev, notifications: { ...next, [key]: !next[key] } }));
    }
  };

  /* ---------------- Security ---------------- */
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password don't match");
      return;
    }
    try {
      setSaving(true);
      const email = localStorage.getItem("user");
      await changePassword({ email, ...passwordForm });
      toast.success("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      const updated = await toggleTwoFactor();
      setSettings(updated);
      toast.success(updated.security.twoFactorEnabled ? "2FA enabled" : "2FA disabled");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBackup = async () => {
    try {
      await triggerBackup();
      toast.success("Backup downloaded");
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ---------------- Roles & Permissions ---------------- */
  const persistRoles = async (nextRoles) => {
    setRolesDraft(nextRoles);
    try {
      const updated = await updateRoles(nextRoles);
      setSettings(updated);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePermission = (roleKey, permKey) => {
    const role = rolesDraft.find((r) => r.key === roleKey);
    if (!role || role.editable === false) return;
    const nextRoles = rolesDraft.map((r) =>
      r.key === roleKey ? { ...r, permissions: { ...r.permissions, [permKey]: !r.permissions[permKey] } } : r
    );
    persistRoles(nextRoles);
  };

  const addCustomRole = () => {
    const name = window.prompt("New role name:");
    if (!name || !name.trim()) return;
    const key = name.trim().toLowerCase().replace(/\s+/g, "-");
    if (rolesDraft.some((r) => r.key === key)) {
      toast.error("A role with that name already exists");
      return;
    }
    const newRole = {
      key,
      name: name.trim(),
      color: "blue",
      editable: true,
      permissions: { view: true, create: false, edit: false, delete: false, export: false, manageUsers: false },
    };
    persistRoles([...rolesDraft, newRole]);
  };

  if (loading || !settings) {
    return (
      <div className="p-8 bg-(--bg-dark) min-h-screen flex items-center justify-center text-(--text-gray) font-medium gap-2">
        <Loader2 size={18} className="animate-spin" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-(--bg-dark) min-h-screen font-sans transition-colors duration-200">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-(--text-white)">Settings</h1>
        <p className="text-sm text-(--text-gray) mt-0.5">Configure your inventory system</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Nav — vertical list on desktop, horizontal scroll pills on mobile */}
        <nav className="flex flex-row lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 lg:w-64 shrink-0">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 rounded-xl text-sm font-medium px-4 py-2.5 whitespace-nowrap shrink-0 lg:shrink transition-all cursor-pointer
                  ${
                    isActive
                      ? "bg-(--primary-purple)/10 text-(--primary-purple) font-semibold"
                      : "text-(--text-gray) hover:bg-(--bg-card)"
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {activeTab === "company" && companyForm && (
            <SectionCard title="Company Profile">
              <div className="flex items-center gap-4 bg-(--bg-dark) border border-(--border-color) rounded-xl p-4 mb-6">
                <div className="h-14 w-14 rounded-xl bg-(--primary-purple) flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {(companyForm.name || "I").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-(--text-white)">{companyForm.name || "Your Company"}</p>
                  <p className="text-sm text-(--text-gray)">{companyForm.email || "no email set"}</p>
                  <button className="text-sm text-(--primary-purple) font-medium mt-0.5 cursor-pointer">
                    Change logo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <Field label="Company Name">
                  <input
                    className={inputClasses}
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  />
                </Field>
                <Field label="Email">
                  <input
                    className={inputClasses}
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    className={inputClasses}
                    value={companyForm.phone}
                    onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  />
                </Field>
                <Field label="Website">
                  <input
                    className={inputClasses}
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  />
                </Field>
                <Field label="Address">
                  <input
                    className={inputClasses}
                    value={companyForm.address}
                    onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                  />
                </Field>
              </div>

              <SaveButton onClick={saveCompanyProfile} saving={saving} />
            </SectionCard>
          )}

          {activeTab === "currency" && currencyForm && (
            <SectionCard title="Currency & Tax Settings">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <Field label="Currency">
                  <select
                    className={inputClasses}
                    value={currencyForm.currency}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, currency: e.target.value })}
                  >
                    {["USD", "EUR", "GBP", "INR", "JPY", "AUD"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Default Tax Rate (%)">
                  <input
                    type="number"
                    step="0.1"
                    className={inputClasses}
                    value={currencyForm.taxRate}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, taxRate: parseFloat(e.target.value) || 0 })}
                  />
                </Field>
                <Field label="Currency Symbol">
                  <input
                    className={inputClasses}
                    value={currencyForm.currencySymbol}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, currencySymbol: e.target.value })}
                  />
                </Field>
                <Field label="Date Format">
                  <select
                    className={inputClasses}
                    value={currencyForm.dateFormat}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, dateFormat: e.target.value })}
                  >
                    {["YYYY-MM-DD", "MM/DD/YYYY", "DD/MM/YYYY"].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <SaveButton onClick={saveCurrencyTax} saving={saving} />
            </SectionCard>
          )}

          {activeTab === "appearance" && (
            <SectionCard title="Appearance">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleThemeSelect("light")}
                  className={`rounded-xl border-2 p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    !darkMode ? "border-(--primary-purple) bg-(--primary-purple)/5" : "border-(--border-color)"
                  }`}
                >
                  <Sun size={22} className="text-amber-400" />
                  <span className="font-medium text-(--text-white)">Light Mode</span>
                  {!darkMode && <span className="text-xs text-(--primary-purple) font-semibold">Active</span>}
                </button>
                <button
                  onClick={() => handleThemeSelect("dark")}
                  className={`rounded-xl border-2 p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer bg-[#0F172A] ${
                    darkMode ? "border-(--primary-purple)" : "border-transparent"
                  }`}
                >
                  <Moon size={22} className="text-slate-300" />
                  <span className="font-medium text-white">Dark Mode</span>
                  {darkMode && <span className="text-xs text-(--primary-purple) font-semibold">Active</span>}
                </button>
              </div>

              <p className="text-xs font-semibold tracking-wide text-(--text-gray) uppercase mb-3">Accent Color</p>
              <div className="flex items-center gap-3 flex-wrap">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleAccentSelect(color)}
                    style={{ backgroundColor: color }}
                    className="h-9 w-9 rounded-full flex items-center justify-center ring-offset-2 ring-offset-(--bg-card) transition-all cursor-pointer"
                  >
                    {accentColor.toLowerCase() === color.toLowerCase() && <Check size={16} className="text-white" />}
                  </button>
                ))}
              </div>
            </SectionCard>
          )}

          {activeTab === "notifications" && (
            <SectionCard title="Notification Preferences">
              <div className="divide-y divide-(--border-color)">
                {[
                  { key: "lowStockAlerts", label: "Low stock alerts" },
                  { key: "newOrderReceived", label: "New order received" },
                  { key: "supplierUpdates", label: "Supplier updates" },
                  { key: "weeklyReportEmail", label: "Weekly report email" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <span className="text-sm font-medium text-(--text-white)">{item.label}</span>
                    <ToggleSwitch
                      checked={settings.notifications[item.key]}
                      onChange={() => handleNotificationToggle(item.key)}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <SectionCard title="Change Password">
                <div className="space-y-4 mb-6 max-w-md">
                  <Field label="Current Password">
                    <input
                      type="password"
                      className={inputClasses}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    />
                  </Field>
                  <Field label="New Password">
                    <input
                      type="password"
                      placeholder="Min. 8 characters"
                      className={inputClasses}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    />
                  </Field>
                  <Field label="Confirm New Password">
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      className={inputClasses}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    />
                  </Field>
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="flex items-center gap-2 bg-(--primary-purple) hover:bg-(--hover-purple) text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                  Change Password
                </button>
              </SectionCard>

              <SectionCard title="Two-Factor Authentication">
                <p className="text-sm text-(--text-gray) mb-4">Add an extra layer of security to your account with 2FA.</p>
                <button
                  onClick={handleToggle2FA}
                  className="flex items-center gap-2 bg-(--bg-dark) border border-(--border-color) hover:border-(--primary-purple) text-(--text-white) px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  {settings.security.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                </button>
              </SectionCard>

              <SectionCard title="Backup & Export">
                <p className="text-sm text-(--text-gray) mb-4">
                  Export all inventory data as CSV or trigger a full database backup.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={exportInventoryCSV}
                    className="flex items-center gap-2 bg-(--bg-dark) border border-(--border-color) hover:border-(--primary-purple) text-(--text-white) px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                  <button
                    onClick={handleBackup}
                    className="flex items-center gap-2 bg-(--bg-dark) border border-(--border-color) hover:border-(--primary-purple) text-(--text-white) px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer"
                  >
                    <Database size={16} />
                    Backup Now
                  </button>
                </div>
              </SectionCard>
            </div>
          )}

          {activeTab === "roles" && (
            <SectionCard title="Roles & Permissions">
              <div className="space-y-4 mb-6">
                {rolesDraft.map((role) => (
                  <div key={role.key} className="bg-(--bg-dark) border border-(--border-color) rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-(--primary-purple)/10 text-(--primary-purple)">
                        {role.name}
                      </span>
                      <span className="font-semibold text-(--text-white)">{role.name}</span>
                      {!role.editable && <span className="text-xs text-(--text-gray)">(locked)</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PERMISSION_KEYS.map((perm) => {
                        const enabled = role.permissions[perm.key];
                        return (
                          <button
                            key={perm.key}
                            onClick={() => togglePermission(role.key, perm.key)}
                            disabled={!role.editable}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
                              ${
                                enabled
                                  ? "bg-(--primary-purple)/10 text-(--primary-purple) border-(--primary-purple)/30"
                                  : "bg-transparent text-(--text-gray) border-(--border-color) line-through"
                              }
                              ${role.editable ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed opacity-70"}`}
                          >
                            {perm.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addCustomRole}
                className="flex items-center gap-2 bg-(--primary-purple) hover:bg-(--hover-purple) text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-sm transition-all cursor-pointer"
              >
                <Plus size={16} />
                Add Custom Role
              </button>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;