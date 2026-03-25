'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            S
          </div>
          <span className="text-xl font-bold text-foreground">SoftSkill</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Về chúng tôi
          </Link>
          <Link href="/terms" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Điều khoản
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Bảo mật
          </Link>
          <Link href="/skills" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Kỹ năng
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <Link href="/register">
            <Button variant="outline" className="hidden sm:inline-flex bg-transparent">
              Đăng ký
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Đăng nhập
            </Button>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/about" 
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Về chúng tôi
            </Link>
            <Link 
              href="/terms" 
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Điều khoản
            </Link>
            <Link 
              href="/privacy" 
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bảo mật
            </Link>
            <Link 
              href="/skills" 
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kỹ năng
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
