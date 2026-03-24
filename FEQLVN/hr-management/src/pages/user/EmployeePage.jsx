import { useEffect, useState, useMemo } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../api/employeeApi";
import { getDepartments } from "../../api/departmentApi";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const avatarColor = (name = "") => {
  const colors = ["#1e88e5","#43a047","#e53935","#8e24aa","#f4511e","#00acc1","#039be5","#3949ab"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
};

const initials = (name = "") =>
    name.split(" ").filter(Boolean).slice(-2).map((w) => w[0]).join("").toUpperCase();

const fmtDate = (iso) => {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/* ─── Pagination ─── */
function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);
  return (
      <div className="emp-pagination">
        <button className="emp-pg-btn" onClick={() => onPage(page - 1)} disabled={page === 1}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" /></svg>
        </button>
        {pages.map((p) => (
            <button key={p} className={`emp-pg-btn ${p === page ? "emp-pg-btn--active" : ""}`} onClick={() => onPage(p)}>{p}</button>
        ))}
        <button className="emp-pg-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
        </button>
      </div>
  );
}

/* ─── Employee Modal ─── */
function EmployeeModal({ mode, initial, departments, onClose, onSaved }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState({
    username: initial?.username || "",
    gender: initial?.gender || "Nam",
    date: initial?.date || "",
    phone: initial?.phone ? String(initial.phone) : "",
    departmentId: initial?.department?.id || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Tên nhân viên không được để trống";
    if (!form.date) e.date = "Ngày sinh không được để trống";
    if (!form.phone.trim()) e.phone = "Số điện thoại không được để trống";
    else if (!/^\d{9,11}$/.test(form.phone.trim())) e.phone = "Số điện thoại không hợp lệ";
    if (!form.departmentId) e.departmentId = "Vui lòng chọn phòng ban";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        gender: form.gender,
        date: form.date,
        phone: Number(form.phone.trim()),
        department: { id: form.departmentId },
      };
      if (isEdit) await updateEmployee(initial.id, payload);
      else await createEmployee(payload);
      onSaved();
    } catch {
      setErrors({ _global: "Có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
        <div className="modal-backdrop" onClick={onClose} />
        <div className="modal-box modal-box--lg" role="dialog" aria-modal="true">
          <div className="modal-header">
            <div>
              <div className="modal-title">{isEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</div>
              <div className="modal-sub">{isEdit ? "Cập nhật thông tin" : "Điền đầy đủ thông tin bên dưới"}</div>
            </div>
            <button className="modal-close" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
          <div className="modal-body">
            <div className="emp-avatar-preview" style={{ background: avatarColor(form.username) }}>
              {form.username ? initials(form.username) : "?"}
            </div>
            <div className="emp-form-grid">
              <div className="emp-field">
                <label className="field-label">Họ và tên *</label>
                <input
                    className={`field-input${errors.username ? " field-input--error" : ""}`}
                    placeholder="Nhập họ và tên..."
                    value={form.username}
                    onChange={(e) => set("username", e.target.value)}
                    autoFocus
                />
                {errors.username && <div className="field-error">{errors.username}</div>}
              </div>
              <div className="emp-field">
                <label className="field-label">Giới tính</label>
                <div className="gender-group">
                  {["Nam", "Nu", "Khac"].map((g) => (
                      <button key={g} className={`gender-btn${form.gender === g ? " gender-btn--active" : ""}`} onClick={() => set("gender", g)} type="button">{g}</button>
                  ))}
                </div>
              </div>
              <div className="emp-field">
                <label className="field-label">Ngày sinh *</label>
                <input
                    className={`field-input${errors.date ? " field-input--error" : ""}`}
                    type="date"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                />
                {errors.date && <div className="field-error">{errors.date}</div>}
              </div>
              <div className="emp-field">
                <label className="field-label">Số điện thoại *</label>
                <input
                    className={`field-input${errors.phone ? " field-input--error" : ""}`}
                    placeholder="Nhập số điện thoại..."
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value.replace(/\D/, ""))}
                />
                {errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>
              <div className="emp-field emp-field--full">
                <label className="field-label">Phòng ban *</label>
                <select
                    className={`field-input field-select${errors.departmentId ? " field-input--error" : ""}`}
                    value={form.departmentId}
                    onChange={(e) => set("departmentId", e.target.value)}
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                {errors.departmentId && <div className="field-error">{errors.departmentId}</div>}
              </div>
            </div>
            {errors._global && <div className="field-error" style={{ marginTop: 12, textAlign: "center" }}>{errors._global}</div>}
          </div>
          <div className="modal-footer">
            <button className="btn-cancel" onClick={onClose} disabled={loading}>Hủy</button>
            <button className="btn-confirm" onClick={handleSubmit} disabled={loading}>
              {loading ? <span className="btn-spinner" /> : isEdit ? "Lưu thay đổi" : "Thêm nhân viên"}
            </button>
          </div>
        </div>
      </>
  );
}

/* ─── Main Page ─── */
function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDep, setFilterDep] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [empData, depData] = await Promise.all([getEmployees(), getDepartments()]);
      setEmployees(empData?.result || []);
      setDepartments(depData?.result || []);
    } catch {
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch = e.username.toLowerCase().includes(search.toLowerCase()) || String(e.phone).includes(search);
      const matchDep = !filterDep || e.department?.id === filterDep;
      return matchSearch && matchDep;
    });
  }, [employees, search, filterDep]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = (v) => { setSearch(v); setPage(1); };
  const handleFilterDep = (v) => { setFilterDep(v); setPage(1); };

  const gClass = (g) => g === "Nam" ? "gender-badge--nam" : g === "Nu" ? "gender-badge--nu" : "gender-badge--khac";

  return (
      <>
        <style>{`
        .emp-wrap { padding: 36px 32px; font-family: 'Lato', sans-serif; animation: emp-fadein 0.35s ease both; }
        @keyframes emp-fadein { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .emp-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:16px; }
        .emp-title { font-family:'Nunito',sans-serif; font-size:24px; font-weight:800; color:#0d2137; letter-spacing:-0.5px; }
        .emp-subtitle { font-size:13.5px; color:#7a9ab8; margin-top:4px; }
        .emp-stats { display:flex; gap:14px; margin-bottom:20px; flex-wrap:wrap; }
        .stat-chip { display:flex; align-items:center; gap:10px; background:#fff; border:1.5px solid #e2edf8; border-radius:12px; padding:10px 16px; box-shadow:0 2px 8px rgba(21,101,192,0.05); }
        .stat-chip__icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; }
        .stat-chip__icon--blue { background:#e8f4fd; color:#1976d2; }
        .stat-chip__icon--green { background:#e8f5e9; color:#388e3c; }
        .stat-chip__icon--purple { background:#f3e5f5; color:#7b1fa2; }
        .stat-chip__val { font-family:'Nunito',sans-serif; font-size:18px; font-weight:800; color:#0d2137; line-height:1; }
        .stat-chip__lbl { font-size:11px; color:#94afc8; margin-top:2px; }
        .emp-toolbar { display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; align-items:center; }
        .search-box { position:relative; flex:1; min-width:200px; max-width:360px; }
        .search-box__icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#94afc8; pointer-events:none; }
        .search-input { width:100%; padding:10px 36px 10px 38px; border:1.5px solid #d6e8f7; border-radius:10px; font-size:14px; font-family:'Lato',sans-serif; color:#0d2137; background:#f8fcff; outline:none; transition:border-color 0.18s; box-sizing:border-box; }
        .search-input:focus { border-color:#42a5f5; box-shadow:0 0 0 3px rgba(66,165,245,0.15); background:#fff; }
        .search-clear { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:#e0edf8; border:none; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#5a85ab; font-size:12px; line-height:1; }
        .filter-select { padding:10px 14px; border:1.5px solid #d6e8f7; border-radius:10px; font-size:14px; font-family:'Lato',sans-serif; color:#2a4560; background:#f8fcff; outline:none; cursor:pointer; min-width:180px; }
        .filter-select:focus { border-color:#42a5f5; }
        .emp-page-size-select { padding:9px 12px; border:1.5px solid #d6e8f7; border-radius:9px; background:#f8fcff; color:#5a85ab; font-size:13px; font-family:'Nunito',sans-serif; font-weight:700; cursor:pointer; outline:none; }
        .btn-add { display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg,#1e88e5,#1565c0); color:#fff; border:none; border-radius:11px; padding:11px 22px; font-size:14px; font-family:'Nunito',sans-serif; font-weight:700; cursor:pointer; box-shadow:0 4px 14px rgba(21,101,192,0.28); transition:all 0.18s ease; white-space:nowrap; }
        .btn-add:hover { filter:brightness(1.07); transform:translateY(-2px); }
        .emp-card { background:#fff; border-radius:18px; border:1px solid #e2edf8; box-shadow:0 4px 20px rgba(21,101,192,0.07); overflow:hidden; }
        /* Table */
        .emp-table { width:100%; border-collapse:collapse; }
        .emp-table thead tr { background:linear-gradient(90deg,#f0f8ff,#f8fcff); border-bottom:2px solid #ddeaf8; }
        .emp-table thead th { padding:15px 20px; text-align:left; font-family:'Nunito',sans-serif; font-size:11.5px; font-weight:800; color:#5a85ab; text-transform:uppercase; letter-spacing:0.9px; }
        .emp-table tbody tr { border-bottom:1px solid #f0f6fc; transition:background 0.13s; }
        .emp-table tbody tr:last-child { border-bottom:none; }
        .emp-table tbody tr:hover { background:#f6fbff; }
        .emp-table td { padding:14px 20px; font-size:14px; color:#2a4560; vertical-align:middle; }
        .stt-badge { display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; background:#eef6fd; color:#1976d2; border-radius:8px; font-size:13px; font-weight:700; font-family:'Nunito',sans-serif; }
        .emp-name-cell { display:flex; align-items:center; gap:11px; }
        .emp-avatar { border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:'Nunito',sans-serif; font-weight:800; flex-shrink:0; letter-spacing:0.5px; }
        .emp-name { font-weight:700; color:#0d2137; font-size:14.5px; }
        .emp-id { font-size:11px; color:#94afc8; margin-top:1px; font-family:'Nunito',sans-serif; }
        .gender-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:12.5px; font-weight:700; font-family:'Nunito',sans-serif; }
        .gender-badge--nam { background:#e3f2fd; color:#1565c0; }
        .gender-badge--nu { background:#fce4ec; color:#c2185b; }
        .gender-badge--khac { background:#f3e5f5; color:#6a1b9a; }
        .dep-tag { display:inline-flex; align-items:center; gap:6px; background:#eef6fd; color:#1976d2; border-radius:8px; padding:5px 10px; font-size:12.5px; font-weight:700; font-family:'Nunito',sans-serif; }
        .action-wrap { display:flex; gap:8px; }
        .btn-edit { padding:6px 15px; border-radius:8px; border:1.5px solid #90caf9; background:#e8f4fd; color:#1565c0; font-size:13px; font-family:'Nunito',sans-serif; font-weight:700; cursor:pointer; transition:all 0.14s; display:flex; align-items:center; gap:5px; }
        .btn-edit:hover { background:#bbdefb; border-color:#42a5f5; transform:translateY(-1px); }
        /* Mobile cards */
        .emp-mobile-list { display:none; padding:12px; gap:10px; flex-direction:column; }
        .emp-mobile-card { background:#fff; border:1.5px solid #e8f2fb; border-radius:14px; padding:14px; box-shadow:0 2px 8px rgba(21,101,192,0.05); }
        .emp-mobile-card__top { display:flex; align-items:center; gap:12px; margin-bottom:10px; }
        .emp-mobile-card__info { flex:1; min-width:0; }
        .emp-mobile-card__name { font-weight:700; font-size:15px; color:#0d2137; }
        .emp-mobile-card__id { font-size:11px; color:#94afc8; margin-top:1px; }
        .emp-mobile-card__meta { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px; }
        .meta-chip { display:inline-flex; align-items:center; gap:5px; font-size:12px; font-family:'Nunito',sans-serif; font-weight:700; padding:4px 10px; border-radius:8px; background:#f0f8ff; color:#4a7fa5; }
        .emp-mobile-card__btn-row { display:flex; gap:8px; }
        .btn-mobile-edit { flex:1; padding:9px; border-radius:9px; border:1.5px solid #90caf9; background:#e8f4fd; color:#1565c0; font-size:13px; font-family:'Nunito',sans-serif; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.14s; }
        .btn-mobile-edit:hover { background:#bbdefb; }
        .btn-mobile-del { flex:1; padding:9px; border-radius:9px; border:1.5px solid #ffcdd2; background:#fff5f5; color:#d32f2f; font-size:13px; font-family:'Nunito',sans-serif; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.14s; }
        .btn-mobile-del:hover { background:#ffebee; }
        /* Footer */
        .emp-footer { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-top:1px solid #eef5fc; background:#fafcff; flex-wrap:wrap; gap:10px; }
        .emp-footer__info { font-size:13px; color:#7a9ab8; }
        .emp-footer__info strong { color:#1976d2; }
        /* Pagination */
        .emp-pagination { display:flex; gap:5px; align-items:center; flex-wrap:wrap; }
        .emp-pg-btn { width:34px; height:34px; border-radius:9px; border:1.5px solid #d6e8f7; background:#f8fcff; color:#5a85ab; font-size:13px; font-family:'Nunito',sans-serif; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.14s; }
        .emp-pg-btn:hover:not(:disabled) { border-color:#90caf9; background:#e8f4fd; color:#1565c0; }
        .emp-pg-btn:disabled { opacity:0.38; cursor:not-allowed; }
        .emp-pg-btn--active { background:#1976d2; border-color:#1976d2; color:#fff; }
        .emp-pg-btn--active:hover { background:#1565c0 !important; }
        /* States */
        .state-box { padding:60px 20px; text-align:center; color:#94afc8; font-size:14.5px; }
        .state-box.is-error { color:#e57373; }
        .loading-dots { display:flex; justify-content:center; gap:6px; margin-bottom:14px; }
        .loading-dots span { width:9px; height:9px; border-radius:50%; background:#64b5f6; animation:emp-bounce 1.3s infinite ease-in-out; }
        .loading-dots span:nth-child(2) { animation-delay:0.18s; background:#42a5f5; }
        .loading-dots span:nth-child(3) { animation-delay:0.36s; background:#1e88e5; }
        @keyframes emp-bounce { 0%,80%,100% { transform:translateY(0); opacity:0.45; } 40% { transform:translateY(-9px); opacity:1; } }
        .empty-state { padding:64px 20px; text-align:center; }
        .empty-state__icon { width:64px; height:64px; background:#eef6fd; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; color:#90caf9; }
        .empty-state__title { font-family:'Nunito',sans-serif; font-size:16px; font-weight:700; color:#4a7fa5; margin-bottom:6px; }
        .empty-state__sub { font-size:13.5px; color:#94afc8; }
        /* Modal */
        .modal-backdrop { position:fixed; inset:0; background:rgba(10,30,55,0.35); backdrop-filter:blur(3px); z-index:100; animation:fade-in 0.2s ease; }
        @keyframes fade-in { from { opacity:0; } to { opacity:1; } }
        .modal-box { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:440px; max-width:calc(100vw - 32px); background:#fff; border-radius:20px; box-shadow:0 20px 60px rgba(10,30,55,0.18); z-index:101; animation:modal-up 0.25s cubic-bezier(0.22,1,0.36,1) both; overflow:hidden; }
        .modal-box--lg { width:520px; }
        .modal-box--sm { width:380px; }
        @keyframes modal-up { from { opacity:0; transform:translate(-50%,calc(-50% + 20px)); } to { opacity:1; transform:translate(-50%,-50%); } }
        .modal-header { display:flex; align-items:flex-start; justify-content:space-between; padding:22px 24px 0; }
        .modal-title { font-family:'Nunito',sans-serif; font-size:17px; font-weight:800; color:#0d2137; }
        .modal-sub { font-size:12.5px; color:#94afc8; margin-top:3px; }
        .modal-close { background:#f0f6fc; border:none; border-radius:8px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#7a9ab8; transition:all 0.15s; flex-shrink:0; }
        .modal-close:hover { background:#ffebee; color:#d32f2f; }
        .modal-body { padding:20px 24px; max-height:calc(100vh - 200px); overflow-y:auto; }
        .emp-avatar-preview { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; color:#fff; font-family:'Nunito',sans-serif; font-size:18px; font-weight:800; margin:0 auto 20px; letter-spacing:0.5px; transition:background 0.3s; }
        .emp-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .emp-field { display:flex; flex-direction:column; }
        .emp-field--full { grid-column:1 / -1; }
        .field-label { display:block; font-size:12.5px; font-weight:700; color:#4a7fa5; margin-bottom:7px; font-family:'Nunito',sans-serif; }
        .field-input { width:100%; padding:10px 13px; border:1.5px solid #d6e8f7; border-radius:10px; font-size:14px; font-family:'Lato',sans-serif; color:#0d2137; background:#f8fcff; outline:none; transition:border-color 0.18s,box-shadow 0.18s; box-sizing:border-box; }
        .field-input:focus { border-color:#42a5f5; box-shadow:0 0 0 3px rgba(66,165,245,0.15); background:#fff; }
        .field-input--error { border-color:#ef9a9a !important; background:#fff8f8; }
        .field-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%2394afc8'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; cursor:pointer; }
        .field-error { font-size:12px; color:#e53935; margin-top:5px; }
        .gender-group { display:flex; gap:8px; flex-wrap:wrap; }
        .gender-btn { padding:8px 14px; border-radius:8px; border:1.5px solid #d6e8f7; background:#f8fcff; color:#5a85ab; font-size:13px; font-family:'Nunito',sans-serif; font-weight:700; cursor:pointer; transition:all 0.15s; }
        .gender-btn--active { background:#1976d2; border-color:#1976d2; color:#fff; box-shadow:0 3px 10px rgba(25,118,210,0.28); }
        .gender-btn:not(.gender-btn--active):hover { border-color:#90caf9; background:#e8f4fd; }
        .modal-footer { display:flex; gap:10px; justify-content:flex-end; padding:0 24px 22px; }
        .btn-cancel { padding:10px 20px; border-radius:10px; border:1.5px solid #ddeaf8; background:#f3f8fd; color:#6b8aab; font-size:14px; font-family:'Nunito',sans-serif; font-weight:700; cursor:pointer; transition:all 0.15s; }
        .btn-cancel:hover { background:#e3f2fd; border-color:#90caf9; }
        .btn-cancel:disabled { opacity:0.5; cursor:not-allowed; }
        .btn-confirm { padding:10px 22px; border-radius:10px; background:linear-gradient(135deg,#1e88e5,#1565c0); color:#fff; border:none; font-size:14px; font-family:'Nunito',sans-serif; font-weight:700; cursor:pointer; box-shadow:0 4px 12px rgba(21,101,192,0.25); transition:all 0.15s; display:flex; align-items:center; justify-content:center; min-width:140px; }
        .btn-confirm:hover { filter:brightness(1.07); transform:translateY(-1px); }
        .btn-confirm:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .btn-danger { padding:10px 22px; border-radius:10px; background:linear-gradient(135deg,#ef5350,#c62828); color:#fff; border:none; font-size:14px; font-family:'Nunito',sans-serif; font-weight:700; cursor:pointer; box-shadow:0 4px 12px rgba(198,40,40,0.22); transition:all 0.15s; display:flex; align-items:center; justify-content:center; min-width:130px; }
        .btn-danger:hover { filter:brightness(1.07); transform:translateY(-1px); }
        .btn-danger:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .btn-spinner { width:16px; height:16px; border:2.5px solid rgba(255,255,255,0.35); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; display:inline-block; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .confirm-icon { font-size:32px; text-align:center; margin-bottom:10px; }
        .confirm-msg { text-align:center; font-size:14.5px; color:#2a4560; line-height:1.6; }
        /* Responsive */
        @media (max-width:1024px) { .emp-wrap { padding:28px 24px; } }
        @media (max-width:768px) {
          .emp-wrap { padding:20px 16px; }
          .emp-title { font-size:20px; }
          .emp-table-wrap { display:none; }
          .emp-mobile-list { display:flex; }
          .emp-header { flex-direction:column; align-items:stretch; }
          .btn-add { justify-content:center; }
          .emp-toolbar { flex-direction:column; align-items:stretch; }
          .search-box { max-width:100%; }
          .filter-select { min-width:unset; width:100%; }
          .emp-stats { flex-wrap:nowrap; overflow-x:auto; padding-bottom:4px; }
          .emp-form-grid { grid-template-columns:1fr; }
          .emp-field--full { grid-column:unset; }
          .emp-footer { flex-direction:column; align-items:center; }
        }
        @media (max-width:480px) {
          .emp-wrap { padding:16px 12px; }
          .modal-footer { flex-direction:column-reverse; }
          .btn-cancel,.btn-confirm,.btn-danger { width:100%; justify-content:center; min-width:unset; }
        }
      `}</style>

        <div className="emp-wrap">
          <div className="emp-header">
            <div>
              <div className="emp-subtitle">Danh sách toàn bộ nhân viên trong hệ thống</div>
            </div>
            <button className="btn-add" onClick={() => setModal({ mode: "add" })}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
              Thêm nhân viên
            </button>
          </div>

          {/* Stats */}
          {!loading && !error && (
              <div className="emp-stats">
                {[
                  { label: "Tổng nhân viên", val: employees.length, cls: "blue", icon: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /> },
                  { label: "Nam", val: employees.filter((e) => e.gender === "Nam").length, cls: "green", icon: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /> },
                  { label: "Nữ", val: employees.filter((e) => e.gender === "Nu").length, cls: "purple", icon: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /> },
                ].map((s) => (
                    <div className="stat-chip" key={s.label}>
                      <div className={`stat-chip__icon stat-chip__icon--${s.cls}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
                      </div>
                      <div>
                        <div className="stat-chip__val">{s.val}</div>
                        <div className="stat-chip__lbl">{s.label}</div>
                      </div>
                    </div>
                ))}
              </div>
          )}

          {/* Toolbar */}
          {!loading && !error && (
              <div className="emp-toolbar">
                <div className="search-box">
              <span className="search-box__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </span>
                  <input
                      className="search-input"
                      placeholder="Tìm theo tên hoặc SĐT..."
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                  />
                  {search && <button className="search-clear" onClick={() => handleSearch("")}>✕</button>}
                </div>
                <select className="filter-select" value={filterDep} onChange={(e) => handleFilterDep(e.target.value)}>
                  <option value="">Tất cả phòng ban</option>
                  {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <select className="emp-page-size-select" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
                  {PAGE_SIZE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s} / trang</option>
                  ))}
                </select>
              </div>
          )}

          <div className="emp-card">
            {loading && (
                <div className="state-box">
                  <div className="loading-dots"><span /><span /><span /></div>
                  <div>Đang tải dữ liệu...</div>
                </div>
            )}
            {error && (
                <div className="state-box is-error">
                  <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
                  <div>{error}</div>
                </div>
            )}
            {!loading && !error && paginated.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                  </div>
                  <div className="empty-state__title">
                    {search || filterDep ? "Không tìm thấy nhân viên phù hợp" : "Chưa có nhân viên nào"}
                  </div>
                  <div className="empty-state__sub">
                    {search || filterDep ? "Thử thay đổi bộ lọc" : "Nhấn \"Thêm nhân viên\" để bắt đầu"}
                  </div>
                </div>
            )}

            {!loading && !error && paginated.length > 0 && (
                <>
                  {/* Desktop Table */}
                  <div className="emp-table-wrap" style={{ overflowX: "auto" }}>
                    <table className="emp-table">
                      <thead>
                      <tr>
                        <th style={{ width: 64 }}>STT</th>
                        <th>Nhân viên</th>
                        <th style={{ width: 100 }}>Giới tính</th>
                        <th style={{ width: 120 }}>Ngày sinh</th>
                        <th style={{ width: 140 }}>Điện thoại</th>
                        <th>Phòng ban</th>
                        <th style={{ width: 180 }}>Hành động</th>
                      </tr>
                      </thead>
                      <tbody>
                      {paginated.map((emp, idx) => (
                          <tr key={emp.id}>
                            <td><span className="stt-badge">{(page - 1) * pageSize + idx + 1}</span></td>
                            <td>
                              <div className="emp-name-cell">
                                <div className="emp-avatar" style={{ background: avatarColor(emp.username), width: 38, height: 38, fontSize: 13 }}>
                                  {initials(emp.username)}
                                </div>
                                <div>
                                  <div className="emp-name">{emp.username}</div>
                                  <div className="emp-id">{emp.id.slice(0, 8)}…</div>
                                </div>
                              </div>
                            </td>
                            <td><span className={`gender-badge ${gClass(emp.gender)}`}>{emp.gender}</span></td>
                            <td style={{ color: "#4a6882" }}>{fmtDate(emp.date)}</td>
                            <td style={{ color: "#4a6882" }}>{emp.phone}</td>
                            <td>
                              {emp.department ? (
                                  <span className="dep-tag">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12z" /></svg>
                                    {emp.department.name}
                            </span>
                              ) : <span style={{ color: "#c5d8ea", fontSize: 13 }}>-</span>}
                            </td>
                            <td>
                              <div className="action-wrap">
                                <button className="btn-edit" onClick={() => setModal({ mode: "edit", emp })}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                                  Sửa
                                </button>
                              </div>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="emp-mobile-list">
                    {paginated.map((emp, idx) => (
                        <div className="emp-mobile-card" key={emp.id}>
                          <div className="emp-mobile-card__top">
                            <div className="emp-avatar" style={{ background: avatarColor(emp.username), width: 44, height: 44, fontSize: 14, borderRadius: 12 }}>
                              {initials(emp.username)}
                            </div>
                            <div className="emp-mobile-card__info">
                              <div className="emp-mobile-card__name">{emp.username}</div>
                              <div className="emp-mobile-card__id">#{(page - 1) * pageSize + idx + 1} · {emp.id.slice(0, 8)}…</div>
                            </div>
                            <span className={`gender-badge ${gClass(emp.gender)}`}>{emp.gender}</span>
                          </div>
                          <div className="emp-mobile-card__meta">
                            <span className="meta-chip">📅 {fmtDate(emp.date)}</span>
                            <span className="meta-chip">📞 {emp.phone}</span>
                            {emp.department && <span className="meta-chip" style={{ background: "#eef6fd", color: "#1976d2" }}>🏢 {emp.department.name}</span>}
                          </div>
                          <div className="emp-mobile-card__btn-row">
                            <button className="btn-mobile-edit" onClick={() => setModal({ mode: "edit", emp })}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                              Chỉnh sửa
                            </button>
                            <button className="btn-mobile-del" onClick={() => setDeleteTarget(emp)}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                              Xóa
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="emp-footer">
                    <div className="emp-footer__info">
                      Hiển thị <strong>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}</strong> trong tổng <strong>{filtered.length}</strong> nhân viên
                      {(search || filterDep) && <span style={{ color: "#94afc8" }}> (đang lọc)</span>}
                    </div>
                    <Pagination page={page} totalPages={totalPages} onPage={setPage} />
                  </div>
                </>
            )}
          </div>
        </div>

        {modal && (
            <EmployeeModal
                mode={modal.mode}
                initial={modal.emp}
                departments={departments}
                onClose={() => setModal(null)}
                onSaved={() => { setModal(null); fetchAll(); }}
            />
        )}
      </>
  );
}

export default EmployeePage;