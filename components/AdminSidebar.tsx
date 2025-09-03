import React, { useState, useRef, useEffect } from "react";
import "../styles/components/sidebar.scss";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";

const sidebarMenu = [
  {
    key: "dashboard",
    label: "Dashboard",
    children: [
      { label: "Tổng quan", path: "/" },
      { label: "Doanh thu theo phim", path: "/movie-revenue" },
    ],
  },
  {
    key: "cinema",
    label: "Quản lý rạp phim",
    children: [
      { label: "Danh sách rạp", path: "/cinema/list" },
      { label: "Thêm rạp", path: "/cinema/create" },
    ],
  },
  {
    key: "movie",
    label: "Quản lý phim",
    children: [
      { label: "Danh sách phim", path: "/movie/list" },
      { label: "Tạo phim", path: "/movie/create" },
    ],
  },
  {
    key: "room",
    label: "Quản lý phòng chiếu",
    children: [
      { label: "Danh sách phòng", path: "/room/list" },
    ],
  },
  // {
  //   key: "seatmap",
  //   label: "Quản lý sơ đồ phòng",
  //   children: [
  //     { label: "Danh sách sơ đồ", path: "/seatmap/list" },
  //     { label: "Tạo sơ đồ", path: "/seatmap/create" },
  //   ],
  // },
  {
    key: "seat",
    label: "Quản lý ghế",
    children: [
      { label: "Danh sách ghế", path: "/seat/list" },
    ],
  },
  {
    key: "showtime",
    label: "Quản lý suất chiếu",
    children: [
      { label: "Danh sách lịch chiếu", path: "/showtime/schedule-list" },
      { label: "Danh sách suất chiếu", path: "/showtime/schedule-showtime" },
    ],
  },
  {
    key: "order",
    label: "Quản lý đơn hàng",
    children: [
      { label: "Danh sách đơn hàng", path: "/order/list" },
    ],
  },
  {
    key: "food",
    label: "Quản lý đồ ăn & combo",
    children: [
      { label: "Danh sách", path: "/food/list" },
    ],
  },
  {
    key: "article",
    label: "Quản lý bài viết",
    children: [
      { label: "Danh sách bài viết", path: "/article/list" },
    ],
  },
  {
    key: "account",
    label: "Quản lý user",
    children: [
      { label: "Danh sách user", path: "/account/list" },
    ],
  },
  
  
];

export default function AdminSidebar() {
  const [openMenus, setOpenMenus] = useState(["dashboard"]);
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const findActive = () => {
    for (const menu of sidebarMenu) {
      for (let i = 0; i < menu.children.length; ++i) {
        if (menu.children[i].path === pathname) {
          return { parent: menu.key, child: i };
        }
      }
    }
    return { parent: "dashboard", child: 0 };
  };

  const [activeMenu, setActiveMenu] = useState(findActive());

  useEffect(() => {
    const active = findActive();
    setActiveMenu(active);
    setOpenMenus((prev) =>
      prev.includes(active.parent) ? prev : [...prev, active.parent]
    );
  }, [pathname]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Dropdown logic
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">ADMIN</span>
        <div className="user-icon-wrapper" ref={dropdownRef}>
          <FontAwesomeIcon
            icon={faUser}
            className="user-icon"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="user-dropdown">
              <div
                className="user-dropdown-item"
                onClick={() => router.push("/account/manage")}
              >
                Manage My Account
              </div>
                <div
                  className="user-dropdown-item"
                  onClick={logout}
                >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      <nav>
        <ul className="sidebar-menu-list">
          {sidebarMenu.map((menu, idx) => (
            <li
              key={menu.key}
              className={
                "sidebar-menu-item " + (openMenus.includes(menu.key) ? "open" : "")
              }
            >
              <div
                className={
                  "sidebar-menu-parent " +
                  (activeMenu.parent === menu.key ? "active" : "")
                }
                onClick={() => toggleMenu(menu.key)}
              >
                <span className="sidebar-menu-label">{menu.label}</span>
                <span className="sidebar-menu-arrow">
                  {openMenus.includes(menu.key) ? "▼" : "▶"}
                </span>
              </div>
              {openMenus.includes(menu.key) && (
                <ul className="sidebar-submenu-list">
                  {menu.children.map((child, cidx) => (
                    <li
                      key={child.label}
                      className={
                        "sidebar-submenu-item " +
                        (activeMenu.parent === menu.key &&
                        activeMenu.child === cidx
                          ? "active"
                          : "")
                      }
                      onClick={() => {
                        setActiveMenu({ parent: menu.key, child: cidx });
                        router.push(child.path);
                      }}
                    >
                      <span>{child.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
