import { ArrowRight } from 'lucide-react';

const faqs = [
  {
    icon: '📅',
    title: 'Bổ lõ sự kiện quản trong?',
    description: 'Không biết quản lịch trình và hệ thống thông thông thông nhật được lịch cả nhân.'
  },
  {
    icon: '✅',
    title: 'Quản ghi nhận điểm?',
    description: 'Quy trình QR Check-in tự động ghi được cấp nhật từ luyến được luôn hệ thống.'
  },
  {
    icon: '📄',
    title: 'CV thiếu điểm nhân?',
    description: 'Hồ sơ năng lực của bạn từ động tổng hợp kỹ năng đạt được qua các hoạt động.'
  }
];

export function FaqProcessSection() {
  return (
    <section className="w-full py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4 text-center text-balance">
            Bạn có đang gặp khó khăn?
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
            Chúng mình thấu hiểu những rắc rối của sinh viên
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl bg-white p-6 border border-border">
                <div className="text-3xl mb-3">{faq.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{faq.title}</h3>
                <p className="text-sm text-muted-foreground">{faq.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Chi với 3 bước đơn giản</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl mb-3">
                  1
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">Khám phá</div>
                  <div className="text-xs text-muted-foreground mt-1">Tìm kiếm các sự kiện/CLB phù hợp với bạn</div>
                </div>
              </div>

              <ArrowRight className="hidden md:block text-muted-foreground" />

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl mb-3">
                  2
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">Tham gia</div>
                  <div className="text-xs text-muted-foreground mt-1">Check-in bằng QR code tại sự kiện</div>
                </div>
              </div>

              <ArrowRight className="hidden md:block text-muted-foreground" />

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl mb-3">
                  3
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground">Chứng nhận</div>
                  <div className="text-xs text-muted-foreground mt-1">Nhận chứng chỉ và cấp nhật CV tự động</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
