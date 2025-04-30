
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Map,
  Users,
  ShoppingBag,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();

  const navItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/admin',
    },
    {
      title: 'Destinasi',
      icon: Map,
      href: '/admin/destinations',
      subItems: [
        {
          title: 'Semua Destinasi',
          href: '/admin/destinations',
        },
        {
          title: 'Tambah Baru',
          href: '/admin/destinations/new',
        }
      ]
    },
    {
      title: 'Pengguna',
      icon: Users,
      href: '/admin/users',
    },
    {
      title: 'Transaksi',
      icon: ShoppingBag,
      href: '/admin/transactions',
    },
    {
      title: 'Laporan',
      icon: BarChart2,
      href: '/admin/reports',
    },
    {
      title: 'Pengaturan',
      icon: Settings,
      href: '/admin/settings',
    },
  ];

  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  const toggleExpand = (title: string) => {
    if (expandedItem === title) {
      setExpandedItem(null);
    } else {
      setExpandedItem(title);
    }
  };

  const isActiveLink = (href: string) => {
    return location.pathname === href;
  };

  const isActiveGroup = (href: string) => {
    return location.pathname.startsWith(href);
  };

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link to="/admin" className="text-xl font-semibold text-primary">
            Admin Panel
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-full",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.subItems ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      "flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors",
                      isActiveGroup(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100",
                      collapsed && "justify-center"
                    )}
                  >
                    <item.icon size={20} className="min-w-[20px]" />
                    {!collapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left">{item.title}</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            expandedItem === item.title ? "transform rotate-180" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                  
                  {(!collapsed && expandedItem === item.title) && (
                    <div className="ml-8 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.href}
                          className={cn(
                            "block px-3 py-2 rounded-md text-sm",
                            isActiveLink(subItem.href)
                              ? "bg-primary/10 text-primary"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                    isActiveLink(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon size={20} className="min-w-[20px]" />
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <button
          className={cn(
            "flex items-center w-full px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
