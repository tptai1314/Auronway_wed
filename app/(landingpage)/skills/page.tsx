'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Skill {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
}

const allSkills: Skill[] = [
  { id: 1, name: 'Giao tiếp', category: 'Kỹ năng cơ bản', description: 'Kỹ năng diễn đạt ý tưởng rõ ràng và hiệu quả trong mọi tình huống giao tiếp', icon: '💬' },
  { id: 2, name: 'Lãnh đạo', category: 'Kỹ năng quản lý', description: 'Khả năng hướng dẫn, truyền cảm hứng và dẫn dắt đội nhóm đạt mục tiêu', icon: '👑' },
  { id: 3, name: 'Làm việc nhóm', category: 'Kỹ năng cộng tác', description: 'Hiệu quả trong môi trường cộng tác và hỗ trợ lẫn nhau', icon: '🤝' },
  { id: 4, name: 'Giải quyết vấn đề', category: 'Kỹ năng tư duy', description: 'Tìm ra giải pháp sáng tạo và hiệu quả cho các tình huống phức tạp', icon: '🧩' },
  { id: 5, name: 'Quản lý thời gian', category: 'Kỹ năng tổ chức', description: 'Lập kế hoạch và tổ chức công việc một cách khoa học và hiệu quả', icon: '⏰' },
  { id: 6, name: 'Tư duy phê phán', category: 'Kỹ năng tư duy', description: 'Phân tích sâu sắc và đánh giá hợp lý các vấn đề một cách khách quan', icon: '🎯' },
  { id: 7, name: 'Sáng tạo', category: 'Kỹ năng tư duy', description: 'Phát sinh ý tưởng mới và độc đáo để giải quyết thách thức', icon: '💡' },
  { id: 8, name: 'Thuyết trình', category: 'Kỹ năng giao tiếp', description: 'Trình bày thông tin một cách thuyết phục và ấn tượng', icon: '🎤' },
  { id: 9, name: 'Nghe lắng', category: 'Kỹ năng giao tiếp', description: 'Tiếp nhận và hiểu rõ thông tin từ người khác một cách tích cực', icon: '👂' },
  { id: 10, name: 'Thích ứng', category: 'Kỹ năng phát triển', description: 'Nhanh chóng thay đổi và điều chỉnh khi môi trường thay đổi', icon: '🔄' },
  { id: 11, name: 'Kiên trì', category: 'Kỹ năng phát triển', description: 'Cam kết hoàn thành mục tiêu đề ra dù gặp khó khăn thách thức', icon: '💪' },
  { id: 12, name: 'Đồng cảm', category: 'Kỹ năng xã hội', description: 'Hiểu và chia sẻ cảm xúc của người khác một cách chân thành', icon: '❤️' },
  { id: 13, name: 'Tự tin', category: 'Kỹ năng cá nhân', description: 'Tin tưởng vào khả năng của bản thân và quyết định của mình', icon: '✨' },
  { id: 14, name: 'Trách nhiệm', category: 'Kỹ năng cá nhân', description: 'Cam kết với hành động và chịu trách nhiệm về kết quả', icon: '📋' },
  { id: 15, name: 'Hợp tác', category: 'Kỹ năng cộng tác', description: 'Làm việc hiệu quả cùng những người khác để đạt mục tiêu chung', icon: '🤲' },
  { id: 16, name: 'Đàm phán', category: 'Kỹ năng chuyên môn', description: 'Tìm được giải pháp đôi bên cùng hài lòng trong mọi tình huống', icon: '🤙' },
  { id: 17, name: 'Tổ chức sự kiện', category: 'Kỹ năng chuyên môn', description: 'Lên kế hoạch và triển khai sự kiện thành công một cách chuyên nghiệp', icon: '📅' },
  { id: 18, name: 'Trí tùy hứng', category: 'Kỹ năng phát triển', description: 'Xử lý tình huống bất ngờ một cách khéo léo và linh hoạt', icon: '🎭' },
  { id: 19, name: 'Phát triển bản thân', category: 'Kỹ năng cá nhân', description: 'Liên tục học hỏi và cải thiện kỹ năng của bản thân', icon: '📈' },
  { id: 20, name: 'Networking', category: 'Kỹ năng xã hội', description: 'Xây dựng và duy trì mối quan hệ chuyên nghiệp hiệu quả', icon: '🌐' }
];

const categories = [
  'Tất cả',
  'Kỹ năng cơ bản',
  'Kỹ năng giao tiếp',
  'Kỹ năng tư duy',
  'Kỹ năng cộng tác',
  'Kỹ năng quản lý',
  'Kỹ năng tổ chức',
  'Kỹ năng phát triển',
  'Kỹ năng cá nhân',
  'Kỹ năng xã hội',
  'Kỹ năng chuyên môn'
];

export default function SkillsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const filteredSkills = allSkills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="w-full overflow-hidden bg-background min-h-screen">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
            20 Kỹ Năng Mềm Thiết Yếu
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Khám phá và phát triển các kỹ năng mềm quan trọng nhất để thành công trong học tập và sự nghiệp.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <Input
            type="search"
            placeholder="Tìm kiếm kỹ năng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md mx-auto"
          />
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSkills.map((skill) => (
            <Card key={skill.id} className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group">
              <CardContent className="p-6">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {skill.icon}
                </div>
                <Badge variant="secondary" className="mb-3 text-xs">
                  {skill.category}
                </Badge>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {skill.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {skill.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Không tìm thấy kỹ năng phù hợp.</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid sm:grid-cols-3 gap-8 text-center">
          <div className="bg-muted/50 rounded-xl p-8">
            <div className="text-4xl font-bold text-primary mb-2">20+</div>
            <p className="text-muted-foreground">Kỹ năng mềm</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-8">
            <div className="text-4xl font-bold text-primary mb-2">10</div>
            <p className="text-muted-foreground">Danh mục kỹ năng</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-8">
            <div className="text-4xl font-bold text-primary mb-2">∞</div>
            <p className="text-muted-foreground">Cơ hội phát triển</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-primary/5 rounded-2xl p-12 border border-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Bắt Đầu Phát Triển Kỹ Năng Ngay Hôm Nay
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Đăng ký tài khoản SoftSkill để theo dõi tiến trình phát triển kỹ năng, 
            tham gia các hoạt động và xây dựng hồ sơ năng lực của bạn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/landingpage/register" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Đăng ký miễn phí
            </a>
            <a 
              href="/landingpage" 
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
