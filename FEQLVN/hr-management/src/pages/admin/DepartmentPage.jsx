import { useEffect, useState } from "react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../api/departmentApi";

function DepartmentModal({ mode, initial, onClose, onSaved }) {
  const [name, setName] = useState(initial?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = mode === "edit";

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Tên phòng ban không được để trống");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        await updateDepartment(initial.id, { name: name.trim() });
      } else {
        await createDepartment({ name: name.trim() });
      }
      onSaved();
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại");
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
            {isEdit ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <label className="field-label">Tên phòng ban</label>
          <input
            className={`field-input ${error ? "field-input--error" : ""}`}
            placeholder="Nhập tên phòng ban..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
          {error && <div className="field-error">{error}</div>}
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Hủy
          </button>
          <button
            className="btn-confirm"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : isEdit ? (
              "Lưu thay đổi"
            ) : (
              "Thêm phòng ban"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

function ConfirmDelete({ dep, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await deleteDepartment(dep.id);
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
            Bạn có chắc muốn xóa phòng ban <strong>"{dep.name}"</strong> không?
            <br />
            <span style={{ fontSize: 13, color: "#94afc8" }}>
              Hành động này không thể hoàn tác.
            </span>
          </div>
          {error && (
            <div
              className="field-error"
              style={{ marginTop: 10, textAlign: "center" }}
            >
              {error}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Hủy
          </button>
          <button
            className="btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? <span className="btn-spinner" /> : "Xóa phòng ban"}
          </button>
        </div>
      </div>
    </>
  );
}

function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDepartments();
      setDepartments(data?.result || []);
    } catch {
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <>
      <style>{`
                .dep-wrap {
                    padding: 36px 32px;
                    font-family: 'Lato', sans-serif;
                    animation: dep-fadein 0.35s ease both;
                }
                @keyframes dep-fadein {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* Header */
                .dep-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
                .dep-title { font-family: 'Nunito', sans-serif; font-size: 24px; font-weight: 800; color: #0d2137; letter-spacing: -0.5px; }
                .dep-subtitle { font-size: 13.5px; color: #7a9ab8; margin-top: 4px; }

                /* Stats */
                .dep-stats { display: flex; gap: 14px; margin-bottom: 24px; flex-wrap: wrap; }
                .stat-chip { display: flex; align-items: center; gap: 10px; background: #fff; border: 1.5px solid #e2edf8; border-radius: 12px; padding: 10px 16px; box-shadow: 0 2px 8px rgba(21,101,192,0.05); }
                .stat-chip__icon { width: 32px; height: 32px; background: #e8f4fd; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #1976d2; }
                .stat-chip__val { font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 800; color: #0d2137; line-height: 1; }
                .stat-chip__lbl { font-size: 11px; color: #94afc8; margin-top: 2px; }

                /* Add button */
                .btn-add { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #1e88e5, #1565c0); color: #fff; border: none; border-radius: 11px; padding: 11px 22px; font-size: 14px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(21,101,192,0.28); transition: all 0.18s ease; white-space: nowrap; }
                .btn-add:hover { filter: brightness(1.07); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(21,101,192,0.36); }
                .btn-add:active { transform: translateY(0); }

                /* Table card */
                .dep-card { background: #fff; border-radius: 18px; border: 1px solid #e2edf8; box-shadow: 0 4px 20px rgba(21,101,192,0.07); overflow: hidden; }

                /* Desktop table */
                .dep-table { width: 100%; border-collapse: collapse; }
                .dep-table thead tr { background: linear-gradient(90deg, #f0f8ff, #f8fcff); border-bottom: 2px solid #ddeaf8; }
                .dep-table thead th { padding: 15px 20px; text-align: left; font-family: 'Nunito', sans-serif; font-size: 11.5px; font-weight: 800; color: #5a85ab; text-transform: uppercase; letter-spacing: 0.9px; }
                .dep-table tbody tr { border-bottom: 1px solid #f0f6fc; transition: background 0.13s; }
                .dep-table tbody tr:last-child { border-bottom: none; }
                .dep-table tbody tr:hover { background: #f6fbff; }
                .dep-table td { padding: 14px 20px; font-size: 14.5px; color: #2a4560; vertical-align: middle; }
                .stt-badge { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; background: #eef6fd; color: #1976d2; border-radius: 8px; font-size: 13px; font-weight: 700; font-family: 'Nunito', sans-serif; }
                .dep-name-cell { display: flex; align-items: center; gap: 10px; }
                .dep-name-icon { width: 34px; height: 34px; background: linear-gradient(135deg, #e3f2fd, #bbdefb); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #1976d2; flex-shrink: 0; }
                .dep-name { font-weight: 600; color: #0d2137; font-size: 14.5px; }
                .action-wrap { display: flex; gap: 8px; }
                .btn-edit { padding: 6px 15px; border-radius: 8px; border: 1.5px solid #90caf9; background: #e8f4fd; color: #1565c0; font-size: 13px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.14s; display: flex; align-items: center; gap: 5px; }
                .btn-edit:hover { background: #bbdefb; border-color: #42a5f5; transform: translateY(-1px); }
                .btn-delete { padding: 6px 15px; border-radius: 8px; border: 1.5px solid #ffcdd2; background: #fff5f5; color: #d32f2f; font-size: 13px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; transition: all 0.14s; display: flex; align-items: center; gap: 5px; }
                .btn-delete:hover { background: #ffebee; border-color: #ef9a9a; transform: translateY(-1px); }

                /* Mobile card list (hidden on desktop) */
                .dep-mobile-list { display: none; padding: 12px; gap: 10px; flex-direction: column; }
                .dep-mobile-card { background: #fff; border: 1.5px solid #e8f2fb; border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 8px rgba(21,101,192,0.05); }
                .dep-mobile-card__num { width: 28px; height: 28px; background: #eef6fd; color: #1976d2; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; font-family: 'Nunito', sans-serif; flex-shrink: 0; }
                .dep-mobile-card__icon { width: 38px; height: 38px; background: linear-gradient(135deg, #e3f2fd, #bbdefb); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #1976d2; flex-shrink: 0; }
                .dep-mobile-card__name { font-weight: 700; font-size: 14.5px; color: #0d2137; flex: 1; }
                .dep-mobile-card__actions { display: flex; gap: 8px; flex-shrink: 0; }
                .btn-icon { width: 34px; height: 34px; border-radius: 9px; border: 1.5px solid; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.14s; background: transparent; }
                .btn-icon--edit { border-color: #90caf9; color: #1565c0; background: #e8f4fd; }
                .btn-icon--edit:hover { background: #bbdefb; }
                .btn-icon--del { border-color: #ffcdd2; color: #d32f2f; background: #fff5f5; }
                .btn-icon--del:hover { background: #ffebee; }

                /* States */
                .state-box { padding: 60px 20px; text-align: center; color: #94afc8; font-size: 14.5px; }
                .state-box.is-error { color: #e57373; }
                .loading-dots { display: flex; justify-content: center; gap: 6px; margin-bottom: 14px; }
                .loading-dots span { width: 9px; height: 9px; border-radius: 50%; background: #64b5f6; animation: dep-bounce 1.3s infinite ease-in-out; }
                .loading-dots span:nth-child(2) { animation-delay: 0.18s; background: #42a5f5; }
                .loading-dots span:nth-child(3) { animation-delay: 0.36s; background: #1e88e5; }
                @keyframes dep-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.45; } 40% { transform: translateY(-9px); opacity: 1; } }
                .empty-state { padding: 64px 20px; text-align: center; }
                .empty-state__icon { width: 64px; height: 64px; background: #eef6fd; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #90caf9; }
                .empty-state__title { font-family: 'Nunito', sans-serif; font-size: 16px; font-weight: 700; color: #4a7fa5; margin-bottom: 6px; }
                .empty-state__sub { font-size: 13.5px; color: #94afc8; }

                /* Modal */
                .modal-backdrop { position: fixed; inset: 0; background: rgba(10,30,55,0.35); backdrop-filter: blur(3px); z-index: 100; animation: fade-in 0.2s ease; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .modal-box { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 440px; max-width: calc(100vw - 32px); background: #fff; border-radius: 20px; box-shadow: 0 20px 60px rgba(10,30,55,0.18); z-index: 101; animation: modal-up 0.25s cubic-bezier(0.22,1,0.36,1) both; overflow: hidden; }
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
                .btn-confirm { padding: 10px 22px; border-radius: 10px; background: linear-gradient(135deg, #1e88e5, #1565c0); color: #fff; border: none; font-size: 14px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(21,101,192,0.25); transition: all 0.15s; display: flex; align-items: center; justify-content: center; min-width: 130px; }
                .btn-confirm:hover { filter: brightness(1.07); transform: translateY(-1px); }
                .btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
                .btn-danger { padding: 10px 22px; border-radius: 10px; background: linear-gradient(135deg, #ef5350, #c62828); color: #fff; border: none; font-size: 14px; font-family: 'Nunito', sans-serif; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(198,40,40,0.22); transition: all 0.15s; display: flex; align-items: center; justify-content: center; min-width: 130px; }
                .btn-danger:hover { filter: brightness(1.07); transform: translateY(-1px); }
                .btn-danger:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
                .btn-spinner { width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .confirm-icon { font-size: 32px; text-align: center; margin-bottom: 10px; }
                .confirm-msg { text-align: center; font-size: 14.5px; color: #2a4560; line-height: 1.6; }

                /* ══ RESPONSIVE ══ */
                @media (max-width: 768px) {
                    .dep-wrap { padding: 20px 16px; }
                    .dep-title { font-size: 20px; }
                    /* Hide table, show cards */
                    .dep-table-wrap { display: none; }
                    .dep-mobile-list { display: flex; }
                    /* Full-width Add btn on small */
                    .dep-header { flex-direction: column; align-items: stretch; }
                    .btn-add { justify-content: center; }
                }

                @media (max-width: 480px) {
                    .dep-wrap { padding: 16px 12px; }
                    .modal-footer { flex-direction: column-reverse; }
                    .btn-cancel, .btn-confirm, .btn-danger { width: 100%; justify-content: center; min-width: unset; }
                }
            `}</style>

      <div className="dep-wrap">
        <div className="dep-header">
          <div>
            <div className="dep-title">Quản lý phòng ban</div>
            <div className="dep-subtitle">
              Danh sách các phòng ban trong hệ thống
            </div>
          </div>
          <button className="btn-add" onClick={() => setModal({ mode: "add" })}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Thêm phòng ban
          </button>
        </div>

        {!loading && !error && (
          <div className="dep-stats">
            <div className="stat-chip">
              <div className="stat-chip__icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 7V3H2v18h20V7H12z" />
                </svg>
              </div>
              <div>
                <div className="stat-chip__val">{departments.length}</div>
                <div className="stat-chip__lbl">Tổng phòng ban</div>
              </div>
            </div>
          </div>
        )}

        <div className="dep-card">
          {loading && (
            <div className="state-box">
              <div className="loading-dots">
                <span />
                <span />
                <span />
              </div>
              <div>Đang tải dữ liệu...</div>
            </div>
          )}
          {error && (
            <div className="state-box is-error">
              <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
              <div>{error}</div>
            </div>
          )}
          {!loading && !error && departments.length === 0 && (
            <div className="empty-state">
              <div className="empty-state__icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 7V3H2v18h20V7H12z" />
                </svg>
              </div>
              <div className="empty-state__title">Chưa có phòng ban nào</div>
              <div className="empty-state__sub">
                Nhấn "Thêm phòng ban" để bắt đầu
              </div>
            </div>
          )}

          {!loading && !error && departments.length > 0 && (
            <>
              <div className="dep-table-wrap" style={{ overflowX: "auto" }}>
                <table className="dep-table">
                  <thead>
                    <tr>
                      <th style={{ width: 72 }}>STT</th>
                      <th>Tên phòng ban</th>
                      <th style={{ width: 190 }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dep, index) => (
                      <tr key={dep.id}>
                        <td>
                          <span className="stt-badge">{index + 1}</span>
                        </td>
                        <td>
                          <div className="dep-name-cell">
                            <div className="dep-name-icon">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                              </svg>
                            </div>
                            <span className="dep-name">{dep.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="action-wrap">
                            <button
                              className="btn-edit"
                              onClick={() => setModal({ mode: "edit", dep })}
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                              </svg>
                              Sửa
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => setDeleteTarget(dep)}
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
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

              <div className="dep-mobile-list">
                {departments.map((dep, index) => (
                  <div className="dep-mobile-card" key={dep.id}>
                    <div className="dep-mobile-card__num">{index + 1}</div>
                    <div className="dep-mobile-card__icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 7V3H2v18h20V7H12z" />
                      </svg>
                    </div>
                    <div className="dep-mobile-card__name">{dep.name}</div>
                    <div className="dep-mobile-card__actions">
                      <button
                        className="btn-icon btn-icon--edit"
                        onClick={() => setModal({ mode: "edit", dep })}
                        title="Sửa"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>
                      <button
                        className="btn-icon btn-icon--del"
                        onClick={() => setDeleteTarget(dep)}
                        title="Xóa"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {modal && (
        <DepartmentModal
          mode={modal.mode}
          initial={modal.dep}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            fetchDepartments();
          }}
        />
      )}
      {deleteTarget && (
        <ConfirmDelete
          dep={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null);
            fetchDepartments();
          }}
        />
      )}
    </>
  );
}

export default DepartmentPage;
