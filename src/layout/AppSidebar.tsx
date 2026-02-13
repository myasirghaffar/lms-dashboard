"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  ChatIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";
import { BookOpen, GraduationCap, Users, DollarSign, ClipboardCheck, Bell, TrendingUp } from "lucide-react";

type UserRole = 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  allowedRoles?: UserRole[];
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // Define navigation items based on requirements with UPDATED PATHS
  const getNavItems = (): NavItem[] => {
    // Common items visible to all or specific roles
    const items: NavItem[] = [];

    // Dashboard - Redirects to role specific dashboard
    const dashboardPath = user?.role === 'SUPER_ADMIN' ? '/dashboard/super-admin' :
      user?.role === 'BRANCH_ADMIN' ? '/dashboard/branch-admin' :
        user?.role === 'TEACHER' ? '/dashboard/teacher' :
          user?.role === 'PARENT' ? '/dashboard/parent' :
            '/dashboard/student';

    items.push({
      icon: <GridIcon />,
      name: "Dashboard",
      path: dashboardPath,
    });

    // Super Admin Items
    if (user?.role === 'SUPER_ADMIN') {
      items.push(
        {
          name: "Branches",
          icon: <BoxCubeIcon />,
          path: "/dashboard/super-admin/branches",
        },
        {
          name: "System Users",
          icon: <UserCircleIcon />,
          subItems: [
            { name: "Admins", path: "/dashboard/super-admin/users/admins" },
            { name: "Principals", path: "/dashboard/super-admin/users/principals" },
          ]
        },
        {
          name: "Finance",
          icon: <DollarSign className="w-5 h-5" />,
          path: "/dashboard/super-admin/finance/overview",
        }
      );
    }

    // Branch Admin Items
    if (user?.role === 'BRANCH_ADMIN' || user?.role === 'SUPER_ADMIN') {
      items.push(
        {
          name: "Students",
          icon: <GraduationCap className="w-5 h-5" />,
          subItems: [
            { name: "All Students", path: "/dashboard/branch-admin/students" },
            { name: "Admissions", path: "/dashboard/branch-admin/students/admissions" },
            { name: "Attendance", path: "/dashboard/branch-admin/students/attendance" },
          ]
        },
        {
          name: "Teachers",
          icon: <Users className="w-5 h-5" />,
          subItems: [
            { name: "All Teachers", path: "/dashboard/branch-admin/teachers" },
            { name: "Schedule", path: "/dashboard/branch-admin/teachers/schedule" },
          ]
        },
        {
          name: "Academics",
          icon: <BookOpen className="w-5 h-5" />,
          subItems: [
            { name: "Classes", path: "/dashboard/branch-admin/academics/classes" },
            { name: "Subjects", path: "/dashboard/branch-admin/academics/subjects" },
            { name: "Timetable", path: "/dashboard/branch-admin/academics/timetable" },
          ]
        }
      );
    }

    // Teacher Items
    if (user?.role === 'TEACHER') {
      items.push(
        {
          name: "My Classes",
          icon: <Users className="w-5 h-5" />,
          path: "/dashboard/teacher/classes",
        },
        {
          name: "Attendance",
          icon: <ClipboardCheck className="w-5 h-5" />,
          path: "/dashboard/teacher/attendance",
        },
        {
          name: "Assignments",
          icon: <BookOpen className="w-5 h-5" />,
          path: "/dashboard/teacher/assignments",
        },
        {
          name: "Exams & Marks",
          icon: <GraduationCap className="w-5 h-5" />,
          path: "/dashboard/teacher/marks",
        }
      );
    }

    // Student Items
    if (user?.role === 'STUDENT') {
      items.push(
        {
          name: "My Subjects",
          icon: <BookOpen className="w-5 h-5" />,
          path: "/dashboard/student/subjects",
        },
        {
          name: "Timetable",
          icon: <CalenderIcon />,
          path: "/dashboard/student/timetable",
        },
        {
          name: "Assignments",
          icon: <ListIcon />,
          path: "/dashboard/student/assignments",
        },
        {
          name: "Results",
          icon: <PieChartIcon />,
          path: "/dashboard/student/results",
        },
        {
          name: "Fees",
          icon: <DollarSign className="w-5 h-5" />,
          path: "/dashboard/student/fees",
        }
      );
    }

    // Parent Items
    if (user?.role === 'PARENT') {
      items.push(
        {
          name: "Children",
          icon: <Users className="w-5 h-5" />,
          path: "/dashboard/parent/children",
        },
        {
          name: "Attendance",
          icon: <ClipboardCheck className="w-5 h-5" />,
          path: "/dashboard/parent/attendance",
        },
        {
          name: "Performance",
          icon: <TrendingUp className="w-5 h-5" />,
          path: "/dashboard/parent/performance",
        },
        {
          name: "Fees",
          icon: <DollarSign className="w-5 h-5" />,
          path: "/dashboard/parent/fees",
        }
      );
    }

    return items;
  };

  const commItems: NavItem[] = [
    {
      name: "Messages",
      icon: <ChatIcon />,
      path: "/dashboard/messages",
    },
    {
      name: "Announcements",
      icon: <Bell className="w-5 h-5" />,
      path: "/dashboard/announcements",
    },
    {
      name: "Calendar",
      icon: <CalenderIcon />,
      path: "/dashboard/calendar",
    },
    {
      name: "Profile",
      icon: <UserCircleIcon />,
      path: "/dashboard/profile",
    }
  ];

  const mainNavItems = getNavItems();

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? mainNavItems : commItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, user]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (navItems: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`${openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span className="ml-auto menu-dropdown-badge menu-dropdown-badge-inactive">
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span className="ml-auto menu-dropdown-badge menu-dropdown-badge-inactive">
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(mainNavItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "General"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(commItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
