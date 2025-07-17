import React, { useState, useEffect } from "react";
import "../styles/components/seatMapModal.scss";

const seatTypeClass = ["seat-normal", "seat-vip", "seat-couple", "seat-disabled", "seat-aisle"];
const seatTypeLabel = ["Ghế thường", "Ghế VIP", "Ghế COUPLE", "Không khả dụng", "Lối đi"];

function generateSeatTypes(rows: number, cols: number) {
  // 0: thường, 1: VIP, 2: couple
  return Array.from({ length: rows }, (_, rIdx) => {
    if (rIdx === rows - 1) return Array(cols).fill(2); // hàng cuối: couple
    if (rIdx >= rows - 7) return Array(cols).fill(1); // 6 hàng trước: VIP
    return Array(cols).fill(0); // còn lại: thường
  });
}

export default function SeatMapModal({ open, onClose, rows = 14, cols = 16 }: { open: boolean; onClose: () => void; rows?: number; cols?: number }) {
  const [seatTypes, setSeatTypes] = useState(() => generateSeatTypes(rows, cols));
  const [editRow, setEditRow] = useState<number|null>(null);

  useEffect(() => {
    setSeatTypes(generateSeatTypes(rows, cols));
    setEditRow(null);
  }, [rows, cols]);

  const handleSeatClick = (rIdx: number, cIdx: number) => {
    if (editRow !== rIdx) return;
    setSeatTypes(prev => {
      const next = prev.map(row => [...row]);
      if (next[rIdx][cIdx] !== 4) {
        next[rIdx][cIdx] = (next[rIdx][cIdx] + 1) % 4;
      }
      return next;
    });
  };

  if (!open) return null;
  return (
    <div className="seatmap-modal-bg">
      <div className="seatmap-modal">
        <div className="seatmap-modal-header">
          <span className="seatmap-modal-title">Cập nhật ghế phòng chiếu</span>
          <button className="seatmap-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="seatmap-modal-screen">MÀN HÌNH</div>
        <div className="seatmap-modal-grid">
          {seatTypes.map((row, rIdx) => (
            <div className="seatmap-row" key={rIdx}>
              {row.map((type, cIdx) => (
                <span
                  key={cIdx}
                  className={`seatmap-seat ${seatTypeClass[type]}${editRow === rIdx ? " editable" : ""}`}
                  onClick={() => handleSeatClick(rIdx, cIdx)}
                  style={editRow === rIdx && type !== 4 ? { cursor: "pointer", border: "2px solid #2196f3" } : {}}
                >
                  {String.fromCharCode(65 + rIdx)}{cIdx + 1}
                </span>
              ))}
              <span
                className="seatmap-row-edit"
                onClick={() => setEditRow(editRow === rIdx ? null : rIdx)}
                title={editRow === rIdx ? "Kết thúc sửa" : "Sửa loại ghế"}
                style={editRow === rIdx ? { color: "#2196f3" } : {}}
              >
                ✏️
              </span>
            </div>
          ))}
        </div>
        <div className="seatmap-modal-legend">
          {seatTypeClass.slice(0,4).map((cls, idx) => (
            <span key={cls} className="seatmap-legend-item"><span className={`seatmap-seat ${cls}`}></span> {seatTypeLabel[idx]}</span>
          ))}
        </div>
      </div>
    </div>
  );
} 