import React, { useState, useEffect } from "react";
import "../styles/components/seatMapModal.scss";
import axios from "axios";

interface Seat {
  seat_id: number;
  seat_code: string;
  row_label: string;
  column_number: number;
  seat_type: "STANDARD" | "VIP" | "COUPLE";
  status: "AVAILABLE" | "SELECTED" | "SOLD" | "UNAVAILABLE";
}

interface SeatMapModalProps {
  open: boolean;
  onClose: () => void;
  theaterSlug?: string;
  roomSlug?: string;
  rows?: number;
  cols?: number;
  roomName?: string;
}

// Map seat type to index for UI
const seatTypeMap: { [key: string]: number } = {
  STANDARD: 0,
  VIP: 1,
  COUPLE: 2,
  UNAVAILABLE: 3, // status UNAVAILABLE maps to type 3
};

const seatTypeClass = ["seat-normal", "seat-vip", "seat-couple", "seat-disabled"];
const seatTypeLabel = ["Ghế thường", "Ghế VIP", "Ghế COUPLE", "Không khả dụng"];

export default function SeatMapModal({ 
  open, 
  onClose, 
  theaterSlug,
  roomSlug,
  rows = 14, 
  cols = 16,
  roomName = ""
}: SeatMapModalProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editRow, setEditRow] = useState<number | null>(null);
  const [seatMap, setSeatMap] = useState<{ [key: string]: { type: number; status: string } }>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch seats from API
  useEffect(() => {
    if (open && theaterSlug && roomSlug) {
      fetchSeats();
    }
  }, [open, theaterSlug, roomSlug]);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:3000/theaters/${theaterSlug}/rooms/${roomSlug}/seats`,
        { withCredentials: true }
      );
      
      const seatsData: Seat[] = response.data;
      setSeats(seatsData);

      // Build seat map from fetched seats
      // Store both display type (for UI) and original seat_type (for saving)
      const map: { [key: string]: { type: number; status: string; originalSeatType?: string } } = {};
      seatsData.forEach((seat) => {
        // If seat is UNAVAILABLE, show as disabled (type 3) but keep original seat_type
        const displayType = seat.status === "UNAVAILABLE" ? 3 : seatTypeMap[seat.seat_type] || 0;
        map[seat.seat_code] = { 
          type: displayType, 
          status: seat.status,
          originalSeatType: seat.seat_type, // Store original seat_type for reference
        };
      });
      setSeatMap(map);
    } catch (err: any) {
      console.error("Error fetching seats:", err);
      setError("Không thể tải danh sách ghế");
      // Initialize empty map if error
      const map: { [key: string]: { type: number; status: string; originalSeatType?: string } } = {};
      for (let r = 0; r < rows; r++) {
        const rowLabel = String.fromCharCode(65 + r);
        for (let c = 1; c <= cols; c++) {
          const seatCode = `${rowLabel}${c}`;
          map[seatCode] = { type: 0, status: "AVAILABLE", originalSeatType: "STANDARD" };
        }
      }
      setSeatMap(map);
    } finally {
      setLoading(false);
    }
  };

  const getSeatType = (rIdx: number, cIdx: number): number => {
    const rowLabel = String.fromCharCode(65 + rIdx);
    const seatCode = `${rowLabel}${cIdx + 1}`;
    return seatMap[seatCode]?.type ?? 0;
  };

  const getSeatStatus = (rIdx: number, cIdx: number): string => {
    const rowLabel = String.fromCharCode(65 + rIdx);
    const seatCode = `${rowLabel}${cIdx + 1}`;
    return seatMap[seatCode]?.status ?? "AVAILABLE";
  };

  const handleSeatClick = (rIdx: number, cIdx: number) => {
    if (editRow !== rIdx) return;
    
    const rowLabel = String.fromCharCode(65 + rIdx);
    const seatCode = `${rowLabel}${cIdx + 1}`;
    const currentType = getSeatType(rIdx, cIdx);
    const currentStatus = getSeatStatus(rIdx, cIdx);
    const originalSeat = seats.find(s => s.seat_code === seatCode);

    // Cycle through: STANDARD (0) -> VIP (1) -> COUPLE (2) -> UNAVAILABLE (3) -> STANDARD (0)
    let newType = (currentType + 1) % 4;
    let newStatus: "AVAILABLE" | "UNAVAILABLE" | "SELECTED" | "SOLD";

    // If switching to UNAVAILABLE (type 3), set status to UNAVAILABLE
    // Keep the original seat_type, just change status
    if (newType === 3) {
      newStatus = "UNAVAILABLE";
    } else {
      // If switching from UNAVAILABLE to available type, set status to AVAILABLE
      if (currentType === 3) {
        newStatus = "AVAILABLE";
      } else {
        // For other types, keep current status if available, otherwise set to AVAILABLE
        newStatus = currentStatus === "UNAVAILABLE" ? "AVAILABLE" : currentStatus;
      }
    }

    // Preserve original seat_type when switching to/from unavailable
    const currentMapEntry = seatMap[seatCode];
    let originalSeatType = currentMapEntry?.originalSeatType;
    
    // If switching to unavailable, preserve the current seat_type
    if (newType === 3) {
      // Keep original seat_type from current entry or from original seat data
      if (!originalSeatType && originalSeat) {
        originalSeatType = originalSeat.seat_type;
      } else if (!originalSeatType) {
        // If no original, determine from current type (before switching to unavailable)
        if (currentType === 0) originalSeatType = "STANDARD";
        else if (currentType === 1) originalSeatType = "VIP";
        else if (currentType === 2) originalSeatType = "COUPLE";
        else originalSeatType = "STANDARD";
      }
    } else {
      // When switching from unavailable to available, restore original seat_type
      // or set based on new type
      if (currentType === 3 && originalSeatType) {
        // Restore original seat_type when coming back from unavailable
        // But newType determines what we want now, so update originalSeatType
        if (newType === 0) originalSeatType = "STANDARD";
        else if (newType === 1) originalSeatType = "VIP";
        else if (newType === 2) originalSeatType = "COUPLE";
      } else {
        // Normal type change
        if (newType === 0) originalSeatType = "STANDARD";
        else if (newType === 1) originalSeatType = "VIP";
        else if (newType === 2) originalSeatType = "COUPLE";
      }
    }

    setSeatMap((prev) => ({
      ...prev,
      [seatCode]: { type: newType, status: newStatus, originalSeatType },
    }));
  };

  const handleSave = async () => {
    if (!theaterSlug || !roomSlug) {
      alert("Thiếu thông tin rạp hoặc phòng");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Prepare updates: only seats that have changed
      const updates: Array<{ seatCode: string; seat_type?: string; status?: string }> = [];
      
      // Get original seats to compare
      const originalSeatsMap: { [key: string]: Seat } = {};
      seats.forEach((seat) => {
        originalSeatsMap[seat.seat_code] = seat;
      });

      // Compare and prepare updates
      Object.keys(seatMap).forEach((seatCode) => {
        const current = seatMap[seatCode];
        const original = originalSeatsMap[seatCode];
        
        if (original) {
          // Seat exists, check if it changed
          const originalType = original.status === "UNAVAILABLE" ? 3 : seatTypeMap[original.seat_type] || 0;
          const originalStatus = original.status;

          if (current.type !== originalType || current.status !== originalStatus) {
            // Determine seat_type from type index
            // Type 3 = UNAVAILABLE (status), keep original seat_type but set status to UNAVAILABLE
            let seat_type: string | undefined;
            
            if (current.type === 3) {
              // When unavailable, keep the original seat_type from database
              // Don't change seat_type, just update status to UNAVAILABLE
              seat_type = undefined; // Don't update seat_type
            } else {
              // When available, update seat_type based on current type
              // Use originalSeatType from map if available, otherwise determine from current.type
              const mapEntry = seatMap[seatCode];
              if (mapEntry?.originalSeatType) {
                // Use the stored originalSeatType
                if (current.type === 0) seat_type = "STANDARD";
                else if (current.type === 1) seat_type = "VIP";
                else if (current.type === 2) seat_type = "COUPLE";
              } else {
                // Fallback: determine from current type
                if (current.type === 0) seat_type = "STANDARD";
                else if (current.type === 1) seat_type = "VIP";
                else if (current.type === 2) seat_type = "COUPLE";
              }
              
              // Only update seat_type if it changed from original
              if (seat_type === original.seat_type) {
                seat_type = undefined; // Don't update if same
              }
            }

            // Only add update if status changed or seat_type needs to change
            if (current.status !== originalStatus || (seat_type !== undefined && seat_type !== original.seat_type)) {
              updates.push({
                seatCode,
                seat_type: seat_type,
                status: current.status,
              });
            }
          }
        } else {
          // New seat (shouldn't happen, but handle it)
          let seat_type = "STANDARD";
          if (current.type === 1) seat_type = "VIP";
          else if (current.type === 2) seat_type = "COUPLE";
          else if (current.type === 3) {
            seat_type = "STANDARD";
          }

          updates.push({
            seatCode,
            seat_type: current.type !== 3 ? seat_type : undefined,
            status: current.status,
          });
        }
      });

      if (updates.length === 0) {
        alert("Không có thay đổi nào để lưu");
        return;
      }

      // Bulk update
      const response = await axios.post(
        `http://localhost:3000/theaters/${theaterSlug}/rooms/${roomSlug}/seats/bulk-update`,
        updates,
        { withCredentials: true }
      );

      const results = response.data;
      const failed = results.filter((r: any) => !r.success);
      
      if (failed.length > 0) {
        alert(`Có ${failed.length} ghế cập nhật thất bại`);
      } else {
        alert(`Đã cập nhật thành công ${updates.length} ghế`);
        // Refresh seats
        await fetchSeats();
        setEditRow(null);
      }
    } catch (err: any) {
      console.error("Error saving seats:", err);
      setError(err.response?.data?.message || "Không thể lưu thay đổi");
      alert(err.response?.data?.message || "Không thể lưu thay đổi");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="seatmap-modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="seatmap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="seatmap-modal-header">
          <span className="seatmap-modal-title">
            Cập nhật ghế phòng chiếu {roomName && `- ${roomName}`}
          </span>
          <button className="seatmap-modal-close" onClick={onClose}>×</button>
        </div>
        {error && (
          <div className="seatmap-modal-error">
            {error}
          </div>
        )}
        {loading ? (
          <div className="seatmap-modal-loading">Đang tải danh sách ghế...</div>
        ) : (
          <>
            <div className="seatmap-modal-screen">MÀN HÌNH</div>
            <div className="seatmap-modal-grid">
              {Array.from({ length: rows }, (_, rIdx) => (
                <div className="seatmap-row" key={rIdx}>
                  {Array.from({ length: cols }, (_, cIdx) => {
                    const type = getSeatType(rIdx, cIdx);
                    const isEditable = editRow === rIdx;
                    return (
                      <span
                        key={cIdx}
                        className={`seatmap-seat ${seatTypeClass[type]}${isEditable ? " editable" : ""}`}
                        onClick={() => handleSeatClick(rIdx, cIdx)}
                        title={`${String.fromCharCode(65 + rIdx)}${cIdx + 1} - ${seatTypeLabel[type]}`}
                      >
                        {String.fromCharCode(65 + rIdx)}{cIdx + 1}
                      </span>
                    );
                  })}
                  <span
                    className={`seatmap-row-edit ${editRow === rIdx ? "active" : ""}`}
                    onClick={() => setEditRow(editRow === rIdx ? null : rIdx)}
                    title={editRow === rIdx ? "Kết thúc sửa" : "Sửa loại ghế"}
                  >
                    ✏️
                  </span>
                </div>
              ))}
            </div>
            <div className="seatmap-modal-legend">
              {seatTypeClass.slice(0, 4).map((cls, idx) => (
                <span key={cls} className="seatmap-legend-item">
                  <span className={`seatmap-seat ${cls}`}></span> {seatTypeLabel[idx]}
                </span>
              ))}
            </div>
            <div className="seatmap-modal-actions">
              <button onClick={onClose}>
                Hủy
              </button>
              <button onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
