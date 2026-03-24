import { useEffect, useState, useMemo } from "react";
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
} from "../../api/UserApi.js";

const ROLES = ["USER", "ADMIN"];
const PAGE_SIZE_OPTIONS = [5, 10, 20];

/* ─── Role Badge ─── */
function RoleBadge({ role }) {
    const isAdmin = role === "ADMIN";
    return (
        <span className={`role-badge ${isAdmin ? "role-badge--admin" : "role-badge--user"}`}>
      {isAdmin ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
      ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
      )}
            {role}
    </span>
    );
}

/* ─── User Modal (Add / Edit) ─── */
function UserModal({ mode, initial, onClose, onSaved }) {
    const [username, setUsername] = useState(initial?.username || "");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(initial?.role || "USER");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const isEdit = mode === "edit";

    const validate = () => {
        const e = {};
        if (!username.trim()) e.username = "Tên người dùng không được để trống";
        if (!isEdit && !password.trim()) e.password = "Mật khẩu không được để trống";
        if (!isEdit && password.length < 6) e.password = "Mật khẩu ít nhất 6 ký tự";
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setLoading(true);
        setErrors({});
        try {
            if (isEdit) {
                await updateUser(initial.id, { username: username.trim(), role });
            } else {
                await createUser({ username: username.trim(), password, role });
            }
            onSaved();
        } catch {
            setErrors({ general: "Có lỗi xảy ra, vui lòng thử lại" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-box" role="dialog" aria-modal="true">
                <div className="modal-header">
                    <div className="modal-title">
                        {isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
                <div className="modal-body">
                    {errors.general && <div className="field-error" style={{ marginBottom: 12, textAlign: "center" }}>{errors.general}</div>}

                    <label className="field-label">Tên người dùng</label>
                    <input
                        className={`field-input ${errors.username ? "field-input--error" : ""}`}
                        placeholder="Nhập tên người dùng..."
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setErrors(p => ({ ...p, username: "" })); }}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        autoFocus
                    />
                    {errors.username && <div className="field-error">{errors.username}</div>}

                    {!isEdit && (
                        <>
                            <label className="field-label" style={{ marginTop: 14 }}>Mật khẩu</label>
                            <input
                                type="password"
                                className={`field-input ${errors.password ? "field-input--error" : ""}`}
                                placeholder="Nhập mật khẩu..."
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            />
                            {errors.password && <div className="field-error">{errors.password}</div>}
                        </>
                    )}

                    <label className="field-label" style={{ marginTop: 14 }}>Vai trò</label>
                    <div className="role-select-wrap">
                        {ROLES.map((r) => (
                            <button
                                key={r}
                                className={`role-option ${role === r ? "role-option--active" : ""}`}
                                onClick={() => setRole(r)}
                                type="button"
                            >
                                {r === "ADMIN" ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                    </svg>
                                )}
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose} disabled={loading}>Hủy</button>
                    <button className="btn-confirm" onClick={handleSubmit} disabled={loading}>
                        {loading ? <span className="btn-spinner" /> : isEdit ? "Lưu thay đổi" : "Thêm người dùng"}
                    </button>
                </div>
            </div>
        </>
    );
}

/* ─── Confirm Delete ─── */
function ConfirmDelete({ user, onClose, onDeleted }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setLoading(true);
        setError("");
        try {
            await deleteUser(user.id);
            onDeleted();
        } catch {
            setError("Xóa thất bại, vui lòng thử lại");
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal-box modal-box--sm" role="dialog" aria-modal="true">
                <div className="modal-header">
                    <div className="modal-title">Xác nhận xóa</div>
                    <button className="modal-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="confirm-icon">🗑️</div>
                    <div className="confirm-msg">
                        Bạn có chắc muốn xóa người dùng <strong>"{user.username}"</strong> không?
                        <br />
                        <span style={{ fontSize: 13, color: "#94afc8" }}>Hành động này không thể hoàn tác.</span>
                    </div>
                    {error && <div className="field-error" style={{ marginTop: 10, textAlign: "center" }}>{error}</div>}
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose} disabled={loading}>Hủy</button>
                    <button className="btn-danger" onClick={handleDelete} disabled={loading}>
                        {loading ? <span className="btn-spinner" /> : "Xóa người dùng"}
                    </button>
                </div>
            </div>
        </>
    );
}

/* ─── Pagination ─── */
function Pagination({ page, totalPages, onPage }) {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return (
        <div className="pagination">
            <button className="pg-btn" onClick={() => onPage(page - 1)} disabled={page === 1}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" /></svg>
            </button>
            {pages.map((p) => (
                <button key={p} className={`pg-btn ${p === page ? "pg-btn--active" : ""}`} onClick={() => onPage(p)}>{p}</button>
            ))}
            <button className="pg-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" /></svg>
            </button>
        </div>
    );
}

/* ─── Main Page ─── */
function UserPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUsers();
            setUsers(data?.result || []);
        } catch {
            setError("Không thể tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const filtered = useMemo(() => {
        let list = users;
        if (roleFilter !== "ALL") list = list.filter((u) => u.role === roleFilter);
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter((u) => u.username.toLowerCase().includes(q));
        }
        return list;
    }, [users, search, roleFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleSearch = (v) => { setSearch(v); setPage(1); };
    const handleRoleFilter = (v) => { setRoleFilter(v); setPage(1); };

    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const userCount = users.filter((u) => u.role === "USER").length;

    return (
        <>
            <style>{`
        .usr-wrap {
          padding: 36px 32px;
          font-family: 'Lato', sans-serif;
          animation: usr-fadein 0.35s ease both;
        }
        @keyframes usr-fadein {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .usr-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .usr-title { font-family: 'Nunito', sans-serif; font-size: 24px; font-weight: 800; color: #0d2137; letter-spacing: -0.5px; }
        .usr-subtitle { font-size: 13.5px; color: #7a9ab8; margin-top: 4px; }

        /* Stats */
        .usr-stats { display: flex; gap: 14px; margin-bottom: 20px; flex-wrap: wrap; }
        .stat-chip { display: flex; align-items: center; gap: 10px; background: #fff; border: 1.5px solid #e2edf8; border-radius: 12px; padding: 10px 16px; box-shadow: 0 2px 8px rgba(21,101,192,0.05); }
        .stat-chip__icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .stat-chip__icon--blue { background: #e8f4fd; color: #1976d2; }
        .stat-chip__icon--gold  { background: #fff8e1; color: #f57f17; }
        .stat-chip__icon--green { background: #e8f5e9; color: #388e3c; }
        .stat-chip__val { font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 800; color: #0d2137; line-height: 1; }
        .stat-chip__lbl { font-size: 11px; color: #94afc8; margin-top: 2px; }

        /* Toolbar */
        .usr-toolbar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
        .search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 360px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94afc8; pointer-events: none; }
        .search-input { width: 100%; padding: 10px 12px 10px 38px; border: 1.5px solid #d6e8f7; border-radius: 10px; font-size: 14px; font-family: 'Lato', sans-serif; color: #0d2137; background: #f8fcff; outline: none; transition: border-color 0.18s, box-shadow 0.18s; box-sizing: border-box; }
        .search-input:focus { border-color: #42a5f5; box-shadow: 0 0 0 3px rgba(66,165,245,0.15); background: #fff; }
        .search-clear { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: #e0edf8; border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #5a85ab; font-size: 12px; }
        .filter-wrap { display: flex; gap: 6px; }
        .filter-btn { padding: 8px 14px; border-radius: 9px; border: 1.5px solid #d6e8f7; background: #f8fcff; color: #5a85ab; font-size: 13px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.15s; }
        .filter-btn:hover { border-color: #90caf9; background: #e8f4fd; }
        .filter-btn--active { background: #1976d2; border-color: #1976d2; color: #fff; }
        .filter-btn--active:hover { background: #1565c0; }

        /* Page size */
        .page-size-select { padding: 8px 12px; border: 1.5px solid #d6e8f7; border-radius: 9px; background: #f8fcff; color: #5a85ab; font-size: 13px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; outline: none; }

        /* Add button */
        .btn-add { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #1e88e5, #1565c0); color: #fff; border: none; border-radius: 11px; padding: 11px 22px; font-size: 14px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(21,101,192,0.28); transition: all 0.18s ease; white-space: nowrap; }
        .btn-add:hover { filter: brightness(1.07); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(21,101,192,0.36); }
        .btn-add:active { transform: translateY(0); }

        /* Card */
        .usr-card { background: #fff; border-radius: 18px; border: 1px solid #e2edf8; box-shadow: 0 4px 20px rgba(21,101,192,0.07); overflow: hidden; }

        /* Table */
        .usr-table { width: 100%; border-collapse: collapse; }
        .usr-table thead tr { background: linear-gradient(90deg, #f0f8ff, #f8fcff); border-bottom: 2px solid #ddeaf8; }
        .usr-table thead th { padding: 15px 20px; text-align: left; font-family: 'Nunito', sans-serif; font-size: 11.5px; font-weight: 800; color: #5a85ab; text-transform: uppercase; letter-spacing: 0.9px; }
        .usr-table tbody tr { border-bottom: 1px solid #f0f6fc; transition: background 0.13s; }
        .usr-table tbody tr:last-child { border-bottom: none; }
        .usr-table tbody tr:hover { background: #f6fbff; }
        .usr-table td { padding: 13px 20px; font-size: 14.5px; color: #2a4560; vertical-align: middle; }
        .stt-badge { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; background: #eef6fd; color: #1976d2; border-radius: 8px; font-size: 13px; font-weight: 700; font-family: 'Nunito', sans-serif; }
        .usr-name-cell { display: flex; align-items: center; gap: 10px; }
        .usr-avatar { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 14px; color: #fff; flex-shrink: 0; }
        .usr-avatar--admin { background: linear-gradient(135deg, #f57f17, #ff8f00); }
        .usr-avatar--user  { background: linear-gradient(135deg, #1e88e5, #1565c0); }
        .usr-name { font-weight: 600; color: #0d2137; font-size: 14.5px; }
        .usr-id   { font-size: 11.5px; color: #94afc8; font-family: 'Courier New', monospace; margin-top: 2px; }
        .action-wrap { display: flex; gap: 8px; }
        .btn-edit { padding: 6px 15px; border-radius: 8px; border: 1.5px solid #90caf9; background: #e8f4fd; color: #1565c0; font-size: 13px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.14s; display: flex; align-items: center; gap: 5px; }
        .btn-edit:hover { background: #bbdefb; border-color: #42a5f5; transform: translateY(-1px); }
        .btn-delete { padding: 6px 15px; border-radius: 8px; border: 1.5px solid #ffcdd2; background: #fff5f5; color: #d32f2f; font-size: 13px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.14s; display: flex; align-items: center; gap: 5px; }
        .btn-delete:hover { background: #ffebee; border-color: #ef9a9a; transform: translateY(-1px); }

        /* Role badge */
        .role-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-family: 'Nunito', sans-serif; font-weight: 800; letter-spacing: 0.5px; }
        .role-badge--admin { background: #fff8e1; color: #f57f17; border: 1.5px solid #ffe082; }
        .role-badge--user  { background: #e3f2fd; color: #1565c0; border: 1.5px solid #90caf9; }

        /* Role selector in modal */
        .role-select-wrap { display: flex; gap: 10px; }
        .role-option { flex: 1; padding: 10px; border-radius: 10px; border: 1.5px solid #d6e8f7; background: #f8fcff; color: #5a85ab; font-size: 13.5px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 7px; }
        .role-option:hover { border-color: #90caf9; background: #e8f4fd; }
        .role-option--active { border-color: #1976d2; background: #e3f2fd; color: #1565c0; box-shadow: 0 0 0 3px rgba(25,118,210,0.12); }

        /* Mobile cards */
        .usr-mobile-list { display: none; padding: 12px; gap: 10px; flex-direction: column; }
        .usr-mobile-card { background: #fff; border: 1.5px solid #e8f2fb; border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 8px rgba(21,101,192,0.05); }
        .usr-mobile-card__num { width: 26px; height: 26px; background: #eef6fd; color: #1976d2; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; font-family: 'Nunito', sans-serif; flex-shrink: 0; }
        .usr-mobile-card__info { flex: 1; min-width: 0; }
        .usr-mobile-card__name { font-weight: 700; font-size: 14px; color: #0d2137; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .usr-mobile-card__id { font-size: 11px; color: #94afc8; font-family: 'Courier New', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .usr-mobile-card__actions { display: flex; gap: 8px; flex-shrink: 0; }
        .btn-icon { width: 34px; height: 34px; border-radius: 9px; border: 1.5px solid; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.14s; background: transparent; }
        .btn-icon--edit { border-color: #90caf9; color: #1565c0; background: #e8f4fd; }
        .btn-icon--edit:hover { background: #bbdefb; }
        .btn-icon--del  { border-color: #ffcdd2; color: #d32f2f; background: #fff5f5; }
        .btn-icon--del:hover  { background: #ffebee; }

        /* Footer bar */
        .usr-footer { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid #eef5fc; background: #fafcff; flex-wrap: wrap; gap: 10px; }
        .usr-footer__info { font-size: 13px; color: #7a9ab8; }
        .usr-footer__info strong { color: #1976d2; }

        /* Pagination */
        .pagination { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; }
        .pg-btn { width: 34px; height: 34px; border-radius: 9px; border: 1.5px solid #d6e8f7; background: #f8fcff; color: #5a85ab; font-size: 13px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.14s; }
        .pg-btn:hover:not(:disabled) { border-color: #90caf9; background: #e8f4fd; color: #1565c0; }
        .pg-btn:disabled { opacity: 0.38; cursor: not-allowed; }
        .pg-btn--active { background: #1976d2; border-color: #1976d2; color: #fff; }
        .pg-btn--active:hover { background: #1565c0 !important; border-color: #1565c0 !important; }

        /* States */
        .state-box { padding: 60px 20px; text-align: center; color: #94afc8; font-size: 14.5px; }
        .state-box.is-error { color: #e57373; }
        .loading-dots { display: flex; justify-content: center; gap: 6px; margin-bottom: 14px; }
        .loading-dots span { width: 9px; height: 9px; border-radius: 50%; background: #64b5f6; animation: usr-bounce 1.3s infinite ease-in-out; }
        .loading-dots span:nth-child(2) { animation-delay: 0.18s; background: #42a5f5; }
        .loading-dots span:nth-child(3) { animation-delay: 0.36s; background: #1e88e5; }
        @keyframes usr-bounce { 0%,80%,100% { transform: translateY(0); opacity: 0.45; } 40% { transform: translateY(-9px); opacity: 1; } }
        .empty-state { padding: 64px 20px; text-align: center; }
        .empty-state__icon { width: 64px; height: 64px; background: #eef6fd; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #90caf9; }
        .empty-state__title { font-family: 'Nunito', sans-serif; font-size: 16px; font-weight: 700; color: #4a7fa5; margin-bottom: 6px; }
        .empty-state__sub { font-size: 13.5px; color: #94afc8; }

        /* Modal */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(10,30,55,0.35); backdrop-filter: blur(3px); z-index: 100; animation: fade-in 0.2s ease; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .modal-box { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 460px; max-width: calc(100vw - 32px); background: #fff; border-radius: 20px; box-shadow: 0 20px 60px rgba(10,30,55,0.18); z-index: 101; animation: modal-up 0.25s cubic-bezier(0.22,1,0.36,1) both; overflow: hidden; }
        .modal-box--sm { width: 380px; }
        @keyframes modal-up { from { opacity: 0; transform: translate(-50%, calc(-50% + 20px)); } to { opacity: 1; transform: translate(-50%, -50%); } }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0; }
        .modal-title { font-family: 'Nunito', sans-serif; font-size: 17px; font-weight: 800; color: #0d2137; }
        .modal-close { background: #f0f6fc; border: none; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #7a9ab8; transition: all 0.15s; }
        .modal-close:hover { background: #ffebee; color: #d32f2f; }
        .modal-body { padding: 20px 24px; }
        .field-label { display: block; font-size: 13px; font-weight: 700; color: #4a7fa5; margin-bottom: 8px; font-family: 'Nunito', sans-serif; }
        .field-input { width: 100%; padding: 11px 14px; border: 1.5px solid #d6e8f7; border-radius: 10px; font-size: 14px; font-family: 'Lato', sans-serif; color: #0d2137; background: #f8fcff; outline: none; transition: border-color 0.18s, box-shadow 0.18s; box-sizing: border-box; }
        .field-input:focus { border-color: #42a5f5; box-shadow: 0 0 0 3px rgba(66,165,245,0.15); background: #fff; }
        .field-input--error { border-color: #ef9a9a; background: #fff8f8; }
        .field-error { font-size: 12.5px; color: #e53935; margin-top: 6px; }
        .modal-footer { display: flex; gap: 10px; justify-content: flex-end; padding: 0 24px 20px; }
        .btn-cancel { padding: 10px 20px; border-radius: 10px; border: 1.5px solid #ddeaf8; background: #f3f8fd; color: #6b8aab; font-size: 14px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.15s; }
        .btn-cancel:hover { background: #e3f2fd; border-color: #90caf9; }
        .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-confirm { padding: 10px 22px; border-radius: 10px; background: linear-gradient(135deg, #1e88e5, #1565c0); color: #fff; border: none; font-size: 14px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(21,101,192,0.25); transition: all 0.15s; display: flex; align-items: center; justify-content: center; min-width: 140px; }
        .btn-confirm:hover { filter: brightness(1.07); transform: translateY(-1px); }
        .btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-danger { padding: 10px 22px; border-radius: 10px; background: linear-gradient(135deg, #ef5350, #c62828); color: #fff; border: none; font-size: 14px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(198,40,40,0.22); transition: all 0.15s; display: flex; align-items: center; justify-content: center; min-width: 140px; }
        .btn-danger:hover { filter: brightness(1.07); transform: translateY(-1px); }
        .btn-danger:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-spinner { width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .confirm-icon { font-size: 32px; text-align: center; margin-bottom: 10px; }
        .confirm-msg { text-align: center; font-size: 14.5px; color: #2a4560; line-height: 1.6; }

        /* Responsive */
        @media (max-width: 768px) {
          .usr-wrap { padding: 20px 16px; }
          .usr-title { font-size: 20px; }
          .usr-table-wrap { display: none; }
          .usr-mobile-list { display: flex; }
          .usr-header { flex-direction: column; align-items: stretch; }
          .btn-add { justify-content: center; }
          .search-wrap { max-width: 100%; }
          .usr-toolbar { flex-direction: column; align-items: stretch; }
          .filter-wrap { flex-wrap: wrap; }
        }
        @media (max-width: 480px) {
          .usr-wrap { padding: 16px 12px; }
          .modal-footer { flex-direction: column-reverse; }
          .btn-cancel, .btn-confirm, .btn-danger { width: 100%; justify-content: center; min-width: unset; }
          .role-select-wrap { flex-direction: column; }
          .usr-footer { flex-direction: column; align-items: center; }
        }
      `}</style>

            <div className="usr-wrap">
                {/* Header */}
                <div className="usr-header">
                    <div>
                        <div className="usr-title">Quản lý người dùng</div>
                        <div className="usr-subtitle">Danh sách tài khoản trong hệ thống</div>
                    </div>
                    <button className="btn-add" onClick={() => setModal({ mode: "add" })}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        Thêm người dùng
                    </button>
                </div>

                {/* Stats */}
                {!loading && !error && (
                    <div className="usr-stats">
                        <div className="stat-chip">
                            <div className="stat-chip__icon stat-chip__icon--blue">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                </svg>
                            </div>
                            <div>
                                <div className="stat-chip__val">{users.length}</div>
                                <div className="stat-chip__lbl">Tổng người dùng</div>
                            </div>
                        </div>
                        <div className="stat-chip">
                            <div className="stat-chip__icon stat-chip__icon--gold">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                </svg>
                            </div>
                            <div>
                                <div className="stat-chip__val">{adminCount}</div>
                                <div className="stat-chip__lbl">Admin</div>
                            </div>
                        </div>
                        <div className="stat-chip">
                            <div className="stat-chip__icon stat-chip__icon--green">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                </svg>
                            </div>
                            <div>
                                <div className="stat-chip__val">{userCount}</div>
                                <div className="stat-chip__lbl">User</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toolbar */}
                {!loading && !error && (
                    <div className="usr-toolbar">
                        <div className="search-wrap">
              <span className="search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </span>
                            <input
                                className="search-input"
                                placeholder="Tìm kiếm tên người dùng..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {search && (
                                <button className="search-clear" onClick={() => handleSearch("")}>✕</button>
                            )}
                        </div>

                        <div className="filter-wrap">
                            {["ALL", "ADMIN", "USER"].map((r) => (
                                <button
                                    key={r}
                                    className={`filter-btn ${roleFilter === r ? "filter-btn--active" : ""}`}
                                    onClick={() => handleRoleFilter(r)}
                                >
                                    {r === "ALL" ? "Tất cả" : r}
                                </button>
                            ))}
                        </div>

                        <select
                            className="page-size-select"
                            value={pageSize}
                            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        >
                            {PAGE_SIZE_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s} / trang</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Main Card */}
                <div className="usr-card">
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
                                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                </svg>
                            </div>
                            <div className="empty-state__title">
                                {search || roleFilter !== "ALL" ? "Không tìm thấy kết quả" : "Chưa có người dùng nào"}
                            </div>
                            <div className="empty-state__sub">
                                {search || roleFilter !== "ALL" ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm" : 'Nhấn "Thêm người dùng" để bắt đầu'}
                            </div>
                        </div>
                    )}

                    {!loading && !error && paginated.length > 0 && (
                        <>
                            {/* Desktop Table */}
                            <div className="usr-table-wrap" style={{ overflowX: "auto" }}>
                                <table className="usr-table">
                                    <thead>
                                    <tr>
                                        <th style={{ width: 72 }}>STT</th>
                                        <th>Người dùng</th>
                                        <th style={{ width: 130 }}>Vai trò</th>
                                        <th style={{ width: 200 }}>Hành động</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {paginated.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>
                                                <span className="stt-badge">{(page - 1) * pageSize + index + 1}</span>
                                            </td>
                                            <td>
                                                <div className="usr-name-cell">
                                                    <div className={`usr-avatar ${user.role === "ADMIN" ? "usr-avatar--admin" : "usr-avatar--user"}`}>
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="usr-name">{user.username}</div>
                                                        <div className="usr-id">{user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><RoleBadge role={user.role} /></td>
                                            <td>
                                                <div className="action-wrap">
                                                    <button className="btn-edit" onClick={() => setModal({ mode: "edit", user })}>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                                        </svg>
                                                        Sửa
                                                    </button>
                                                    <button className="btn-delete" onClick={() => setDeleteTarget(user)}>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                                        </svg>
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="usr-mobile-list">
                                {paginated.map((user, index) => (
                                    <div className="usr-mobile-card" key={user.id}>
                                        <div className="usr-mobile-card__num">{(page - 1) * pageSize + index + 1}</div>
                                        <div className={`usr-avatar ${user.role === "ADMIN" ? "usr-avatar--admin" : "usr-avatar--user"}`} style={{ width: 38, height: 38, fontSize: 15 }}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="usr-mobile-card__info">
                                            <div className="usr-mobile-card__name">{user.username}</div>
                                            <div className="usr-mobile-card__id">{user.id}</div>
                                            <div style={{ marginTop: 4 }}><RoleBadge role={user.role} /></div>
                                        </div>
                                        <div className="usr-mobile-card__actions">
                                            <button className="btn-icon btn-icon--edit" onClick={() => setModal({ mode: "edit", user })} title="Sửa">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                                </svg>
                                            </button>
                                            <button className="btn-icon btn-icon--del" onClick={() => setDeleteTarget(user)} title="Xóa">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="usr-footer">
                                <div className="usr-footer__info">
                                    Hiển thị <strong>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}</strong> trong tổng <strong>{filtered.length}</strong> người dùng
                                    {(search || roleFilter !== "ALL") && <span style={{ color: "#94afc8" }}> (đang lọc)</span>}
                                </div>
                                <Pagination page={page} totalPages={totalPages} onPage={setPage} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {modal && (
                <UserModal
                    mode={modal.mode}
                    initial={modal.user}
                    onClose={() => setModal(null)}
                    onSaved={() => { setModal(null); fetchUsers(); }}
                />
            )}
            {deleteTarget && (
                <ConfirmDelete
                    user={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={() => { setDeleteTarget(null); fetchUsers(); }}
                />
            )}
        </>
    );
}

export default UserPage;