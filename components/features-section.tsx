import { Search, QrCode, Award, BarChart3, FileText, Bell } from 'lucide-react';

const features = [
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Event Discovery',
    description: 'Khám phá hàng trăm sự kiện, workshop và hoạt động CLB phù hợp với định hướng của bạn.'
  },
  {
    icon: <QrCode className="h-6 w-6" />,
    title: 'QR Check-in',
    description: 'Điểm danh nhanh chóng tại sự kiện, hỗ trợ ghi nhận sự kiện vào hệ thống.'
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Skill Profile',
    description: 'Hồ sơ năng lực thực quản hiện thị các nhóm kỹ năng được tích lũy và đạt được.'
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Auto Training Points',
    description: 'Tự động đổ vào và tính điểm rèn luyện theo quy định của trường học mà không cần đơn lẻ.'
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'CV Export',
    description: 'Xuất và sở hữu lịch thanhnh bản CV chuyên nghiệp, sẽn sàng để ứng tuyển thực tập.'
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: 'Reminders',
    description: 'Nhận lịch sự kiện sắp tới và gợi ý các hoạt động đáp ứng hợp lí để bạn không bỏ lỡ.'
  }
];

export function FeaturesSection() {
  return (
    <section className="w-full py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4 text-balance">
            Mọi công cụ bạn cần để bắt phá
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trải nghiệm quy trình tích lũy kỹ năng khác từ lúc phát hiện sự kiện đến chứng nhận hoàn thành.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-block p-3 bg-blue-100 rounded-lg text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
