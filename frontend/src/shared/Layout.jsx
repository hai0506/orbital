import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Sun, Moon } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PV2 from "@/styles/PV2.png"
import { useState, useEffect } from 'react';
import api from '@/api';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout({ heading, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDark, setIsDark] = useState(() => localStorage.getItem('pv-theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pv-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pv-theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const role = localStorage.getItem("ROLE");
  const username = localStorage.getItem("username");
  const logo = username?.charAt(0)?.toUpperCase() || "?";

  const [profile, setProfile] = useState();
  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileRes = await api.get('core/profile/');
        setProfile(profileRes.data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    }
    fetchProfile();
  }, []);

  const vendorNavigation = [
    { name: 'Listings',    href: '/' },
    { name: 'Offers',      href: '/offers' },
    { name: 'Fundraisers', href: '/fundraisers' },
    { name: 'Chats',       href: '/chats' },
    { name: 'Search',      href: '/search' },
  ];

  const orgNavigation = [
    { name: 'Listings',       href: '/' },
    { name: 'Offers',         href: '/offers' },
    { name: 'My Listings',    href: '/listings' },
    { name: 'Create Listing', href: '/create' },
    { name: 'Fundraisers',    href: '/fundraisers' },
    { name: 'Chats',          href: '/chats' },
    { name: 'Search',         href: '/search' },
  ];

  const navigation = role === 'vendor' ? vendorNavigation : orgNavigation;

  const userNavigation = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Sign out', onClick: handleLogout },
  ];

  const navBase = 'bg-[#0a0818]';
  const linkActive = 'bg-white/10 text-white ring-1 ring-inset ring-[#7c3aed]/50';
  const linkIdle = 'text-gray-300 hover:bg-white/10 hover:text-white transition-colors';
  const iconBtn = 'relative rounded-full bg-white/5 p-1.5 text-gray-400 hover:text-white hover:bg-white/10 focus:ring-2 focus:ring-[#7c3aed] focus:outline-hidden transition-colors';

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className={navBase}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo + links */}
            <div className="flex items-center">
              <div className="shrink-0">
                <img alt="ProjectVendor" src={PV2} className="h-12 w-auto" />
              </div>
              <div className="hidden md:block">
                <div className="ml-8 flex items-baseline space-x-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={classNames(
                          isActive ? linkActive : linkIdle,
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                type="button"
                onClick={() => setIsDark(d => !d)}
                className={iconBtn}
                aria-label="Toggle theme"
              >
                {isDark
                  ? <Sun aria-hidden="true" className="size-5 text-yellow-300" />
                  : <Moon aria-hidden="true" className="size-5" />
                }
              </button>

              {/* Bell */}
              <button type="button" className={iconBtn}>
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-5" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-1">
                <MenuButton className="relative flex items-center rounded-full bg-white/5 focus:outline-hidden focus:ring-2 focus:ring-[#7c3aed] focus:ring-offset-2 focus:ring-offset-[#0a0818]">
                  <span className="sr-only">Open user menu</span>
                  {profile?.pfp
                    ? <img src={profile.pfp} className="size-8 rounded-full object-cover" alt="" />
                    : <div className="size-8 flex items-center justify-center rounded-full pv-avatar text-white font-semibold text-sm">{logo}</div>
                  }
                </MenuButton>
                <MenuItems
                  transition
                  className="pv-dropdown absolute right-0 z-10 mt-2 w-48 origin-top-right py-1 transition focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      {item.href ? (
                        <Link to={item.href} className="block px-4 py-2 text-sm">
                          {item.name}
                        </Link>
                      ) : (
                        <button onClick={item.onClick} className="block w-full text-left px-4 py-2 text-sm">
                          {item.name}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>

            {/* Mobile hamburger */}
            <div className="-mr-2 flex md:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-[#7c3aed] focus:outline-hidden">
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    isActive ? linkActive : linkIdle,
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                >
                  {item.name}
                </DisclosureButton>
              );
            })}
          </div>
          <div className="border-t border-white/10 pt-4 pb-3">
            <div className="flex items-center px-5">
              {profile?.pfp
                ? <img src={profile.pfp} className="size-8 rounded-full object-cover" alt="" />
                : <div className="size-8 flex items-center justify-center rounded-full pv-avatar text-white font-semibold text-sm">{logo}</div>
              }
              <div className="ml-3">
                <div className="text-base font-medium text-white">{username}</div>
                <div className="text-sm font-medium" style={{ color: '#a78bfa' }}>{role}</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button type="button" onClick={() => setIsDark(d => !d)} className={iconBtn} aria-label="Toggle theme">
                  {isDark ? <Sun className="size-5 text-yellow-300" /> : <Moon className="size-5" />}
                </button>
                <button type="button" className={iconBtn}>
                  <BellIcon aria-hidden="true" className="size-5" />
                </button>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map((item) =>
                item.onClick ? (
                  <DisclosureButton key={item.name} as="button" onClick={item.onClick}
                    className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                    {item.name}
                  </DisclosureButton>
                ) : (
                  <DisclosureButton key={item.name} as={Link} to={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                    {item.name}
                  </DisclosureButton>
                )
              )}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      {/* Page header */}
      <header className="pv-page-header">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex items-center gap-3">
          <div className="pv-page-accent-bar" />
          <h1>{heading}</h1>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
