import { Button } from '@/components/ui/button';
import { Mail, QrCode } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full bg-background py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div>
            <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-primary">
              🎯 Từ đông hòa CV phiên bản 2.0
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Tích lũy kỹ năng mềm. <span className="text-primary">Xây dựng CV</span> ngay từ năm nhất.
            </h1>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Nền tảng giúp sinh viên kết nối với các câu lạc bộ, ghi nhận thành tích ngoài khóa và từ đó nâng cao kỹ năng cá nhân một cách chuyên nghiệp.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base">
                <Mail className="mr-2 h-4 w-4" />
                Tham gia ngay
              </Button>
              <Button size="lg" variant="outline" className="border-foreground text-foreground hover:bg-muted text-base bg-transparent">
                Xem demo
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">CÂU LẠC BỘ</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">15k+</div>
                <div className="text-sm text-muted-foreground">SINH VIÊN</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">KỸ NĂNG/THÁNG</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl bg-white shadow-2xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
                <div className="text-sm font-medium text-foreground">Dashboard cá nhân</div>
                <div className="ml-auto flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300" />
                  <div className="h-2 w-2 rounded-full bg-gray-300" />
                  <div className="h-2 w-2 rounded-full bg-gray-300" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Giao tiếp</div>
                    <div className="h-2 w-24 bg-primary rounded-full" style={{ width: '85%' }} />
                  </div>
                  <div className="text-lg font-bold text-primary">85%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Làm việc nhóm</div>
                    <div className="h-2 w-24 bg-green-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <div className="text-lg font-bold text-green-600">92%</div>
                </div>
                <div className="border-t border-border pt-4 mt-4">
                  <div className="text-xs text-muted-foreground font-medium mb-3">HOẠT ĐỘNG GẦN ĐÂY</div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-foreground">Thành viên Ban Tổ Chức</div>
                        <div className="text-xs text-muted-foreground">Workshop Kỹ năng thuyết trình</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-foreground">Chứng chỉ Excel Advanced</div>
                        <div className="text-xs text-muted-foreground">Hoàn thành khóa học kỹ năng bộ</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
