import React, { useState } from "react";
import "../styles/components/sidebar.scss";
import { useRouter, usePathname } from "next/navigation";

const sidebarMenu = [
  {
    key: "dashboard",
    label: "Dashboard",
    children: [
      { label: "Tổng quan", path: "/home" },
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
      { label: "Danh sách lịch chiếu", path: "/showtime/list" },
      { label: "Danh sách suất chiếu", path: "/showtime/schedule" },
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
  // Tìm active menu theo pathname
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
  React.useEffect(() => {
    setActiveMenu(findActive());
    const active = findActive();
    setOpenMenus((prev) =>
      prev.includes(active.parent) ? prev : [...prev, active.parent]
    );
  }, [pathname]);
  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-title">ADMIN</div>
      <nav>
        <ul className="sidebar-menu-list">
          {sidebarMenu.map((menu, idx) => (
            <li key={menu.key} className={"sidebar-menu-item " + (openMenus.includes(menu.key) ? "open" : "") }>
              <div
                className={"sidebar-menu-parent " + (activeMenu.parent === menu.key ? "active" : "")}
                onClick={() => toggleMenu(menu.key)}
              >
                <span className="sidebar-menu-label">{menu.label}</span>
                <span className="sidebar-menu-arrow">{openMenus.includes(menu.key) ? "▼" : "▶"}</span>
              </div>
              {openMenus.includes(menu.key) && (
                <ul className="sidebar-submenu-list">
                  {menu.children.map((child, cidx) => (
                    <li
                      key={child.label}
                      className={
                        "sidebar-submenu-item " +
                        (activeMenu.parent === menu.key && activeMenu.child === cidx ? "active" : "")
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