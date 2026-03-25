import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Nguyễn Văn A",
      role: "CEO & Founder",
      description: "Người sáng lập với hơn 10 năm kinh nghiệm trong giáo dục đại học.",
      avatar: "👨‍💼"
    },
    {
      name: "Trần Thị B",
      role: "CTO",
      description: "Chuyên gia công nghệ với đam mê phát triển EdTech.",
      avatar: "👩‍💻"
    },
    {
      name: "Lê Văn C",
      role: "Head of Content",
      description: "Phụ trách phát triển nội dung và chương trình đào tạo kỹ năng.",
      avatar: "👨‍🎓"
    },
    {
      name: "Phạm Thị D",
      role: "UX Designer",
      description: "Thiết kế trải nghiệm người dùng tối ưu cho sinh viên.",
      avatar: "👩‍🎨"
    }
  ];

  const milestones = [
    { year: "2023", event: "Thành lập SoftSkill Platform" },
    { year: "2024", event: "Ra mắt phiên bản beta" },
    { year: "2024", event: "Đạt 10,000 sinh viên đăng ký" },
    { year: "2025", event: "Mở rộng đến 50 trường đại học" },
    { year: "2026", event: "Ra mắt ứng dụng di động" }
  ];

  return (
    <main className="w-full overflow-hidden bg-background min-h-screen">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
            Về Chúng Tôi
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            SoftSkill là nền tảng hàng đầu giúp sinh viên Việt Nam phát triển kỹ năng mềm, 
            xây dựng hồ sơ năng lực và chuẩn bị sẵn sàng cho thị trường lao động.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Sứ Mệnh</h2>
              <p className="text-muted-foreground">
                Trang bị cho mỗi sinh viên Việt Nam những kỹ năng mềm thiết yếu, 
                giúp họ tự tin bước vào thị trường lao động và thành công trong sự nghiệp.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="text-4xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Tầm Nhìn</h2>
              <p className="text-muted-foreground">
                Trở thành nền tảng phát triển kỹ năng mềm số 1 Việt Nam, 
                kết nối sinh viên với cơ hội việc làm và phát triển bản thân.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Giá Trị Cốt Lõi</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "💡", title: "Đổi mới", desc: "Liên tục cải tiến và sáng tạo" },
              { icon: "🤝", title: "Hợp tác", desc: "Cùng nhau phát triển và thành công" },
              { icon: "🎓", title: "Chất lượng", desc: "Cam kết mang lại giá trị thực" },
              { icon: "❤️", title: "Tâm huyết", desc: "Đặt sinh viên làm trung tâm" }
            ].map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Đội Ngũ</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Hành Trình Phát Triển</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <span className="text-primary font-bold text-lg">{milestone.year}</span>
                    <p className="text-muted-foreground">{milestone.event}</p>
                  </div>
                  <div className="w-4 h-4 bg-primary rounded-full z-10 flex-shrink-0"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Liên Hệ Với Chúng Tôi</h2>
          <p className="text-muted-foreground mb-6">
            Bạn có câu hỏi hoặc muốn hợp tác? Chúng tôi luôn sẵn sàng lắng nghe!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-muted-foreground">
            <span>📧 contact@softskill.vn</span>
            <span>📞 1900-xxxx</span>
            <span>📍 TP. Hồ Chí Minh, Việt Nam</span>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
