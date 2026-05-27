"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, memo, useMemo, useCallback } from "react"
import { useBranch } from "@/contexts/branch-context"
//import { useSettings } from "@/contexts/SettingsContext"
import { useUserDepartment } from "@/contexts/user-department-context"
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Stethoscope,
  User,
  Bed,
  LayoutDashboard,
  BarChart3,
  Pill,
  TestTube,
  Shield,
  CreditCard,
  Building,
  UserCog,
  Phone,
  Target,
  Clock,
  UserCheck,
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  Zap,
  UserPlus,
  Receipt,
  IndianRupee,
  AlertTriangle,
  Menu,
  X,
  MessageSquare,
  MapPinned,
  ScrollText,
  Cog,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import authService from "@/lib/authService"
import { apiCache } from "@/lib/api-cache"

interface NavigationItem {
  title: string
  icon: any
  href?: string
  items?: NavigationItem[]
}

interface MenuItem {
  id: number
  path: string
  name: string
  icon: string
  sub_menu: SubMenuItem[]
}

interface SubMenuItem {
  id: number
  path: string
  name: string
  icon?: string
  add: number
  edit: number
  delete: number
  view: number
}

interface SideMenuData {
  menu: MenuItem
}

// Icon mapping for dynamic menu
const iconMap: { [key: string]: any } = {
  'Home': Home,
  'home': Home,
  'Users': Users,
  'users': Users,
  'Calendar': Calendar,
  'calendar': Calendar,
  'FileText': FileText,
  'filetext': FileText,
  'file-text': FileText,
  'Settings': Settings,
  'settings': Settings,
  'Stethoscope': Stethoscope,
  'stethoscope': Stethoscope,
  'User': User,
  'user': User,
  'Bed': Bed,
  'bed': Bed,
  'LayoutDashboard': LayoutDashboard,
  'layoutdashboard': LayoutDashboard,
  'layout-dashboard': LayoutDashboard,
  'dashboard': LayoutDashboard,
  'Dashboard': LayoutDashboard,
  'BarChart3': BarChart3,
  'barchart3': BarChart3,
  'bar-chart-3': BarChart3,
  'Pill': Pill,
  'pill': Pill,
  'TestTube': TestTube,
  'testtube': TestTube,
  'test-tube': TestTube,
  'Shield': Shield,
  'shield': Shield,
  'CreditCard': CreditCard,
  'creditcard': CreditCard,
  'credit-card': CreditCard,
  'Building': Building,
  'building': Building,
  'UserCog': UserCog,
  'usercog': UserCog,
  'user-cog': UserCog,
  'Phone': Phone,
  'phone': Phone,
  'Target': Target,
  'target': Target,
  'Clock': Clock,
  'clock': Clock,
  'UserCheck': UserCheck,
  'usercheck': UserCheck,
  'user-check': UserCheck,
  'Package': Package,
  'package': Package,
  'ShoppingCart': ShoppingCart,
  'shoppingcart': ShoppingCart,
  'shopping-cart': ShoppingCart,
  'Truck': Truck,
  'truck': Truck,
  'DollarSign': DollarSign,
  'dollarsign': DollarSign,
  'dollar-sign': DollarSign,
  'Zap': Zap,
  'zap': Zap,
  'UserPlus': UserPlus,
  'userplus': UserPlus,
  'user-plus': UserPlus,
  'Receipt': Receipt,
  'receipt': Receipt,
  'IndianRupee': IndianRupee,
  'indianrupee': IndianRupee,
  'indian-rupee': IndianRupee,
  'AlertTriangle': AlertTriangle,
  'alerttriangle': AlertTriangle,
  'alert-triangle': AlertTriangle,
  'MessageSquare': MessageSquare,
  'messagesquare': MessageSquare,
  'message-square': MessageSquare,
  'ShieldCheck': Shield,
  'shieldcheck': Shield,
  'shield-check': Shield,
  'MapPinned': Building,
  'mappinned': Building,
  'map-pinned': Building,
  'ScrollText': FileText,
  'scrolltext': FileText,
  'scroll-text': FileText,
  'Cog': Settings,
  'cog': Settings,
  'users': UserCog,
  'departments': Building,
  'locations': Building,
  'roles': Shield,
  'system': Settings,
  'audit-logs': FileText,
  'audit_logs': FileText,
  'telecaller': Phone,
  'pharmacy': Pill,
  'billing': Receipt,
  'reports': BarChart3,
  'appointments': Calendar,
  'front-office': Building,
  'front_office': Building,
  'hr-management': Users,
  'hr_management': Users,
  'doctor-management': Stethoscope,
  'doctor_management': Stethoscope,
  'inventory': Package,
  'accounts': IndianRupee,
  'expenses': IndianRupee,
  'vitals': Zap,
  'laboratory': TestTube,
  'queue': Clock,
  'patient-portal': User,
  'patient_portal': User,
  'masters': ShieldCheck,
}

const getIcon = (iconName: string) => {
  if (!iconName) return Home;
  const normalized = iconName.toLowerCase().replace(/-/g, '').replace(/_/g, '');
  return iconMap[normalized] || iconMap[iconName] || Home;
}

// Shared user data hook to prevent duplicate API calls
const useUserData = () => {
  const { currentBranch } = useBranch()
  const { userDepartment } = useUserDepartment()
  const [userName, setUserName] = useState<string>('User')
  const [userInitials, setUserInitials] = useState<string>('U')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isLoaded) return // Prevent multiple calls

    const fetchUserData = async () => {
      try {
        const user = authService.getCurrentUser()
        const token = authService.getCurrentToken()
        const apiUrl = authService.getSettingsApiUrl()

        // Use authService user data first as it's fastest
        if (user) {
          const firstName = user.firstName || user.first_name || ''
          const lastName = user.lastName || user.last_name || ''
          const fullName = `${firstName} ${lastName}`.trim() || user.user_name || 'User'
          setUserName(fullName)
          setUserInitials(`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.user_name?.charAt(0)?.toUpperCase() || 'U')
        }

        // Fetch detailed user data if needed
        const userResponse = await fetch(`${apiUrl}/settings/users/${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          const firstName = userData.firstName || ''
          const lastName = userData.lastName || ''
          const fullName = `${firstName} ${lastName}`.trim() || user?.user_name || 'User'
          setUserName(fullName)
          setUserInitials(`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user?.user_name?.charAt(0)?.toUpperCase() || 'U')
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchUserData()
  }, [currentBranch, isLoaded])

  return { userDepartment, userName, userInitials }
}

const isItemActive = (item: NavigationItem, currentPath: string) => {
  if (!item.href || item.href === '#') return false;

  // Normalize paths for comparison
  const normalize = (path: string) => {
    let p = path.toLowerCase().trim();
    if (!p.startsWith('/')) p = '/' + p;
    if (p.endsWith('/')) p = p.slice(0, -1);
    // Ensure both either have or don't have /admin prefix if possible, 
    // but better to just check if one ends with the other or matches partially
    return p;
  };

  const normHref = normalize(item.href);
  const normPath = normalize(currentPath);

  // Exact match
  if (normPath === normHref) return true;

  // Check with /admin prefix if match fails
  if (normPath === '/admin' + normHref || normHref === '/admin' + normPath) return true;

  // Dashboard items should be strict match only
  if (item.title.toLowerCase().includes('dashboard')) return false;

  // Sub-path match
  if (normPath.startsWith(normHref + '/') || normPath.startsWith('/admin' + normHref + '/')) return true;

  return false;
}

const hasActiveChild = (item: NavigationItem, currentPath: string) => {
  if (!item.items) return false
  return item.items.some(child => isItemActive(child, currentPath))
}

const SidebarItem = memo(({
  item,
  level = 0,
  activePath,
  onItemClick,
  isCollapsed,
}: {
  item: NavigationItem;
  level?: number;
  activePath: string;
  onItemClick?: () => void;
  isCollapsed?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.items && item.items.length > 0
  const isActive = isItemActive(item, activePath) || hasActiveChild(item, activePath)

  // Auto-expand if current path matches any child
  useEffect(() => {
    if (hasChildren) {
      if (hasActiveChild(item, activePath)) {
        setIsOpen(true)
      }
    }
  }, [activePath, hasChildren, item])

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const href = item.href && !item.href.startsWith('/admin') && item.href !== '#'
    ? `/admin${item.href.startsWith('/') ? '' : '/'}${item.href}`
    : (item.href || '#')

  const content = hasChildren ? (
    <button
      onClick={toggleOpen}
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-300 group hover:bg-blue-50/50",
        level > 0 && !isCollapsed && "ml-4",
        isActive && "bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600 rounded-l-none",
        isCollapsed && "px-0 justify-center h-12 w-12 mx-auto"
      )}
    >
      <div className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
        <item.icon className={cn("h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110", isActive ? "text-blue-600" : "text-gray-400")} />
        {!isCollapsed && <span className="truncate">{item.title}</span>}
      </div>
      {!isCollapsed && (
        isOpen ? (
          <ChevronDown className="h-4 w-4 flex-shrink-0 opacity-50" />
        ) : (
          <ChevronRight className="h-4 w-4 flex-shrink-0 opacity-50" />
        )
      )}
    </button>
  ) : (
    <Link
      href={href}
      onClick={onItemClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 group hover:bg-blue-50/50 text-left",
        level > 0 && !isCollapsed && "ml-4",
        isCollapsed && "px-0 justify-center h-10 w-10 mx-auto",
        isActive && "bg-blue-50 text-blue-600 shadow-sm border-l-4 border-blue-600 rounded-l-none",
      )}
    >
      <item.icon className={cn("h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110", isActive ? "text-blue-600" : "text-gray-400")} />
      {!isCollapsed && <span className="truncate">{item.title}</span>}
    </Link>
  )

  return (
    <div className="w-full">
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {item.title}
          </TooltipContent>
        </Tooltip>
      ) : (
        content
      )}
      {isOpen && (
        <div className="mt-1 space-y-1">
          {item.items?.map((subItem, index) => (
            <SidebarItem
              key={index}
              item={subItem}
              level={level + 1}
              activePath={activePath}
              onItemClick={onItemClick}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      )}
    </div>
  )
})

SidebarItem.displayName = "SidebarItem"

// Desktop Sidebar Component
const DesktopSidebar = memo(() => {
  const { currentBranch } = useBranch()
  const { userDepartment, userName, userInitials } = useUserData()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved) setIsCollapsed(saved === 'true')
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
  }

  const navigationItems = useMemo(() => {
    if (!mounted) return []
    try {
      const sideMenuData = localStorage.getItem('sidemenu')
      if (sideMenuData) {
        const parsedMenu: SideMenuData[] = JSON.parse(sideMenuData)
        return parsedMenu.map(item => {
          const itemPath = item.menu.path.startsWith('/') ? item.menu.path : `/${item.menu.path}`
          return {
            title: item.menu.name,
            icon: getIcon(item.menu.icon),
            href: item.menu.sub_menu.length === 0 ? itemPath : undefined,
            items: item.menu.sub_menu.length > 0 ? item.menu.sub_menu.map(sub => {
              const subPath = sub.path.startsWith('/') ? sub.path : `/${sub.path}`
              return {
                title: sub.name,
                href: subPath,
                icon: getIcon(sub.icon || item.menu.icon)
              }
            }) : undefined
          }
        })
      }
      return []
    } catch (error) {
      return []
    }
  }, [mounted])

  return (
    <div className={cn(
      "hidden lg:flex h-full flex-col bg-card border-r border-border transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo Section - Premium Refresh */}
      <div className={cn(
        "flex items-center gap-3 h-20 transition-all duration-300 relative overflow-hidden",
        isCollapsed ? "justify-center px-2" : "px-6"
      )}>
        {/* Subtle background glow for logo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none" />
        
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl shadow-sm border border-blue-50">
                <img
                  src="/images/vithyou.png"
                  alt="V-Pride Logo"
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/images/vithyou.png"
                  }}
                />
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 h-8 w-8 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all">
              <Menu className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 h-8 w-8 hover:bg-blue-50 text-gray-400 hover:text-blue-600">
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <TooltipProvider>
          {navigationItems.map((item, index) => (
            <SidebarItem key={index} item={item} activePath={pathname} isCollapsed={isCollapsed} />
          ))}
        </TooltipProvider>
      </nav>

      {/* User Info */}
      <div className="border-t border-border p-4">
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "gap-3"
        )}>
          <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">{userInitials}</span>
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userDepartment}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('authToken')
                  localStorage.removeItem('user')
                  localStorage.removeItem('sidemenu')
                  localStorage.removeItem('moduleAccess')
                  localStorage.removeItem('selectedBranchId')
                  localStorage.removeItem('location_id')
                  localStorage.removeItem('selected_location_id')
                  window.location.href = '/admin/login'
                }}
                className="text-xs p-1 h-auto"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

// Mobile Sidebar Content Component  
const MobileSidebarContent = memo(({ onItemClick }: { onItemClick?: () => void }) => {
  const { currentBranch } = useBranch()
  const { userDepartment, userName, userInitials } = useUserData()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigationItems = useMemo(() => {
    if (!mounted) return []
    try {
      const sideMenuData = localStorage.getItem('sidemenu')
      if (sideMenuData) {
        const parsedMenu: SideMenuData[] = JSON.parse(sideMenuData)
        return parsedMenu.map(item => {
          const itemPath = item.menu.path.startsWith('/') ? item.menu.path : `/${item.menu.path}`
          return {
            title: item.menu.name,
            icon: getIcon(item.menu.icon),
            href: item.menu.sub_menu.length === 0 ? itemPath : undefined,
            items: item.menu.sub_menu.length > 0 ? item.menu.sub_menu.map(sub => {
              const subPath = sub.path.startsWith('/') ? sub.path : `/${sub.path}`
              return {
                title: sub.name,
                href: subPath,
                icon: getIcon(sub.icon || item.menu.icon)
              }
            }) : undefined
          }
        })
      }
      return []
    } catch (error) {
      return []
    }
  }, [mounted])

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-border px-6 h-16">
        <img
          src="/images/vithyou.png"
          alt="VithYou Logo"
          className="h-[60px] w-48 object-contain"
          onError={(e) => {
            e.currentTarget.src = "/images/vithyou.png"
          }}
        />
        {currentBranch && (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground truncate">{currentBranch.code}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <TooltipProvider>
          {navigationItems.map((item, index) => (
            <SidebarItem key={index} item={item} activePath={pathname} onItemClick={onItemClick} />
          ))}
        </TooltipProvider>
      </nav>

      {/* User Info */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">{userInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userDepartment}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem('authToken')
              localStorage.removeItem('user')
              localStorage.removeItem('sidemenu')
              localStorage.removeItem('moduleAccess')
              localStorage.removeItem('selectedBranchId')
              localStorage.removeItem('location_id')
              localStorage.removeItem('selected_location_id')
              window.location.href = '/admin/login'
            }}
            className="text-xs"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
})

DesktopSidebar.displayName = 'DesktopSidebar'
MobileSidebarContent.displayName = 'MobileSidebarContent'

export default function Sidebar() {
  return <DesktopSidebar />
}

export { MobileSidebarContent }