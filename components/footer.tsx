import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/landingpage" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                S
              </div>
              <span className="font-bold text-foreground">SoftSkill</span>
            </Link>
            <p className="text-xs text-muted-foreground">
              Nền tảng tích lũy kỹ năng mềm cho sinh viên đại học.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Về chúng tôi</h4>
            <div className="space-y-2">
              <Link href="/landingpage/about" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Giới thiệu</Link>
              <Link href="/landingpage/skills" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Kỹ năng</Link>
              <a href="mailto:contact@softskill.vn" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Liên hệ</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Tài khoản</h4>
            <div className="space-y-2">
              <Link href="/landingpage/auth" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Đăng nhập</Link>
              <Link href="/landingpage/register" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Đăng ký</Link>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">FAQ</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Pháp lý</h4>
            <div className="space-y-2">
              <Link href="/landingpage/terms" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Điều khoản dịch vụ</Link>
              <Link href="/landingpage/privacy" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Chính sách bảo mật</Link>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Cookie</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © 2026 SoftSkill Platform. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Facebook
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
