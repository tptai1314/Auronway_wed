'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Skill {
  id: number;
  name: string;
  description: string;
  image: string;
  level: string;
  category: string;
  benefits: string[];
  howToImprove: string[];
  relatedSkills: string[];
}

const skills: Skill[] = [
  { 
    id: 1, 
    name: 'Giao tiếp', 
    level: 'Level 5.0', 
    description: 'Kỹ năng diễn đạt ý tưởng rõ ràng và hiệu quả trong mọi tình huống giao tiếp', 
    image: '/skills/communication.jpg',
    category: 'Kỹ năng cơ bản',
    benefits: [
      'Xây dựng mối quan hệ tốt đẹp',
      'Tăng cường hiệu quả làm việc nhóm',
      'Giải quyết xung đột hiệu quả',
      'Nâng cao cơ hội nghề nghiệp'
    ],
    howToImprove: [
      'Luyện tập thuyết trình trước gương',
      'Tham gia các câu lạc bộ hùng biện',
      'Đọc sách về kỹ năng giao tiếp',
      'Thực hành lắng nghe chủ động'
    ],
    relatedSkills: ['Thuyết trình', 'Nghe lắng', 'Đàm phán']
  },
  { 
    id: 2, 
    name: 'Lãnh đạo', 
    level: 'Level 5.0', 
    description: 'Khả năng hướng dẫn, truyền cảm hứng và dẫn dắt đội nhóm đạt mục tiêu', 
    image: '/skills/leadership.jpg',
    category: 'Kỹ năng quản lý',
    benefits: [
      'Tạo động lực cho đội nhóm',
      'Đưa ra quyết định hiệu quả',
      'Phát triển năng lực nhân viên',
      'Đạt được mục tiêu tổ chức'
    ],
    howToImprove: [
      'Nhận trách nhiệm lãnh đạo dự án nhỏ',
      'Học hỏi từ các nhà lãnh đạo giỏi',
      'Tham gia khóa đào tạo leadership',
      'Thực hành đưa ra quyết định'
    ],
    relatedSkills: ['Quản lý thời gian', 'Làm việc nhóm', 'Trách nhiệm']
  },
  { 
    id: 3, 
    name: 'Làm việc nhóm', 
    level: 'Level 5.0', 
    description: 'Hiệu quả trong môi trường cộng tác và hỗ trợ lẫn nhau', 
    image: '/skills/teamwork.jpg',
    category: 'Kỹ năng cộng tác',
    benefits: [
      'Hoàn thành công việc nhanh hơn',
      'Học hỏi từ đồng nghiệp',
      'Tăng sự sáng tạo nhóm',
      'Xây dựng môi trường làm việc tích cực'
    ],
    howToImprove: [
      'Tham gia các dự án nhóm',
      'Học cách chia sẻ công việc',
      'Phát triển kỹ năng lắng nghe',
      'Chấp nhận ý kiến khác biệt'
    ],
    relatedSkills: ['Hợp tác', 'Giao tiếp', 'Đồng cảm']
  },
  { 
    id: 4, 
    name: 'Giải quyết vấn đề', 
    level: 'Level 5.0', 
    description: 'Tìm ra giải pháp sáng tạo và hiệu quả cho các tình huống phức tạp', 
    image: '/skills/problem-solving.jpg',
    category: 'Kỹ năng tư duy',
    benefits: [
      'Đối mặt thách thức tự tin hơn',
      'Tăng khả năng ra quyết định',
      'Nâng cao hiệu suất công việc',
      'Trở thành người đáng tin cậy'
    ],
    howToImprove: [
      'Phân tích vấn đề từ nhiều góc độ',
      'Học các phương pháp tư duy logic',
      'Thực hành giải đố và câu đố',
      'Tìm hiểu case study thực tế'
    ],
    relatedSkills: ['Tư duy phê phán', 'Sáng tạo', 'Thích ứng']
  },
  { 
    id: 5, 
    name: 'Quản lý thời gian', 
    level: 'Level 5.0', 
    description: 'Lập kế hoạch và tổ chức công việc một cách khoa học và hiệu quả', 
    image: '/skills/time-management.jpg',
    category: 'Kỹ năng tổ chức',
    benefits: [
      'Hoàn thành công việc đúng hạn',
      'Giảm căng thẳng và áp lực',
      'Cân bằng công việc và cuộc sống',
      'Tăng năng suất làm việc'
    ],
    howToImprove: [
      'Sử dụng công cụ quản lý thời gian',
      'Lập danh sách việc cần làm',
      'Ưu tiên công việc quan trọng',
      'Tránh các yếu tố gây xao lãng'
    ],
    relatedSkills: ['Tổ chức sự kiện', 'Trách nhiệm', 'Kiên trì']
  },
  { 
    id: 6, 
    name: 'Tư duy phê phán', 
    level: 'Level 5.0', 
    description: 'Phân tích sâu sắc và đánh giá hợp lý các vấn đề một cách khách quan', 
    image: '/skills/critical-thinking.jpg',
    category: 'Kỹ năng tư duy',
    benefits: [
      'Ra quyết định sáng suốt hơn',
      'Tránh sai lầm và thiên kiến',
      'Đánh giá thông tin chính xác',
      'Giải quyết vấn đề hiệu quả'
    ],
    howToImprove: [
      'Đặt câu hỏi "tại sao" thường xuyên',
      'Tìm kiếm các nguồn thông tin đa dạng',
      'Học logic và lập luận',
      'Thực hành tranh luận có văn hóa'
    ],
    relatedSkills: ['Giải quyết vấn đề', 'Sáng tạo', 'Thích ứng']
  },
  { 
    id: 7, 
    name: 'Sáng tạo', 
    level: 'Level 5.0', 
    description: 'Phát sinh ý tưởng mới và độc đáo để giải quyết thách thức', 
    image: '/skills/creativity.jpg',
    category: 'Kỹ năng tư duy',
    benefits: [
      'Tìm ra giải pháp độc đáo',
      'Nổi bật trong công việc',
      'Thích ứng với thay đổi',
      'Tạo giá trị mới cho tổ chức'
    ],
    howToImprove: [
      'Thử nghiệm những điều mới mẻ',
      'Kết hợp ý tưởng từ nhiều lĩnh vực',
      'Dành thời gian để brainstorm',
      'Không sợ thất bại khi thử nghiệm'
    ],
    relatedSkills: ['Tư duy phê phán', 'Trí tùy hứng', 'Thích ứng']
  },
  { 
    id: 8, 
    name: 'Thuyết trình', 
    level: 'Level 5.0', 
    description: 'Trình bày thông tin một cách thuyết phục và ấn tượng', 
    image: '/skills/presentation.jpg',
    category: 'Kỹ năng giao tiếp',
    benefits: [
      'Truyền đạt ý tưởng hiệu quả',
      'Tăng sự tự tin trước đám đông',
      'Gây ấn tượng với người nghe',
      'Thuyết phục đối tác và khách hàng'
    ],
    howToImprove: [
      'Luyện tập trước gương hoặc camera',
      'Tham gia câu lạc bộ Toastmasters',
      'Nghiên cứu kỹ thuật kể chuyện',
      'Sử dụng visual aids hiệu quả'
    ],
    relatedSkills: ['Giao tiếp', 'Tự tin', 'Sáng tạo']
  },
  { 
    id: 9, 
    name: 'Nghe lắng', 
    level: 'Level 5.0', 
    description: 'Tiếp nhận và hiểu rõ thông tin từ người khác một cách tích cực', 
    image: '/skills/listening.jpg',
    category: 'Kỹ năng giao tiếp',
    benefits: [
      'Hiểu rõ nhu cầu của người khác',
      'Xây dựng mối quan hệ tốt đẹp',
      'Tránh hiểu lầm trong giao tiếp',
      'Thu thập thông tin chính xác'
    ],
    howToImprove: [
      'Tập trung hoàn toàn khi người khác nói',
      'Đặt câu hỏi để hiểu rõ hơn',
      'Tránh ngắt lời người đang nói',
      'Thể hiện sự quan tâm bằng cử chỉ'
    ],
    relatedSkills: ['Giao tiếp', 'Đồng cảm', 'Hợp tác']
  },
  { 
    id: 10, 
    name: 'Thích ứng', 
    level: 'Level 5.0', 
    description: 'Nhanh chóng thay đổi và điều chỉnh khi môi trường thay đổi', 
    image: '/skills/adaptability.jpg',
    category: 'Kỹ năng phát triển',
    benefits: [
      'Đối mặt thay đổi một cách tích cực',
      'Học hỏi nhanh kỹ năng mới',
      'Thành công trong môi trường biến động',
      'Giảm căng thẳng khi đối mặt thách thức'
    ],
    howToImprove: [
      'Đặt bản thân vào tình huống mới',
      'Chấp nhận rằng thay đổi là tất yếu',
      'Học từ những thất bại',
      'Phát triển tư duy linh hoạt'
    ],
    relatedSkills: ['Kiên trì', 'Sáng tạo', 'Tự tin']
  },
  { 
    id: 11, 
    name: 'Kiên trì', 
    level: 'Level 5.0', 
    description: 'Cam kết hoàn thành mục tiêu đề ra dù gặp khó khăn thách thức', 
    image: '/skills/perseverance.jpg',
    category: 'Kỹ năng phát triển',
    benefits: [
      'Đạt được mục tiêu dài hạn',
      'Vượt qua thất bại và khó khăn',
      'Xây dựng uy tín và sự tin cậy',
      'Phát triển sức mạnh tinh thần'
    ],
    howToImprove: [
      'Đặt mục tiêu nhỏ và đạt được từng bước',
      'Tìm nguồn động lực bên trong',
      'Học từ những người kiên trì',
      'Ghi nhận tiến bộ của bản thân'
    ],
    relatedSkills: ['Trách nhiệm', 'Tự tin', 'Thích ứng']
  },
  { 
    id: 12, 
    name: 'Đồng cảm', 
    level: 'Level 5.0', 
    description: 'Hiểu và chia sẻ cảm xúc của người khác một cách chân thành', 
    image: '/skills/empathy.jpg',
    category: 'Kỹ năng xã hội',
    benefits: [
      'Xây dựng mối quan hệ sâu sắc',
      'Hiểu nhu cầu của khách hàng',
      'Giải quyết xung đột hiệu quả',
      'Tạo môi trường làm việc tích cực'
    ],
    howToImprove: [
      'Lắng nghe mà không phán xét',
      'Đặt mình vào vị trí của người khác',
      'Quan sát ngôn ngữ cơ thể',
      'Thể hiện sự quan tâm chân thành'
    ],
    relatedSkills: ['Nghe lắng', 'Giao tiếp', 'Hợp tác']
  },
  { 
    id: 13, 
    name: 'Tự tin', 
    level: 'Level 5.0', 
    description: 'Tin tưởng vào khả năng của bản thân và quyết định của mình', 
    image: '/skills/confidence.jpg',
    category: 'Kỹ năng cá nhân',
    benefits: [
      'Dám đương đầu với thách thức',
      'Gây ấn tượng tích cực',
      'Ra quyết định nhanh chóng',
      'Truyền cảm hứng cho người khác'
    ],
    howToImprove: [
      'Ghi nhận thành công của bản thân',
      'Chuẩn bị kỹ lưỡng trước mọi việc',
      'Học từ những lần thất bại',
      'Nói chuyện tích cực với bản thân'
    ],
    relatedSkills: ['Thuyết trình', 'Lãnh đạo', 'Kiên trì']
  },
  { 
    id: 14, 
    name: 'Trách nhiệm', 
    level: 'Level 5.0', 
    description: 'Cam kết với hành động và chịu trách nhiệm về kết quả', 
    image: '/skills/responsibility.jpg',
    category: 'Kỹ năng cá nhân',
    benefits: [
      'Xây dựng sự tin cậy từ người khác',
      'Phát triển sự chuyên nghiệp',
      'Tạo ra kết quả chất lượng',
      'Trưởng thành trong công việc'
    ],
    howToImprove: [
      'Nhận nhiệm vụ và hoàn thành đúng hạn',
      'Thừa nhận sai lầm và học từ đó',
      'Theo dõi và báo cáo tiến độ',
      'Chủ động giải quyết vấn đề'
    ],
    relatedSkills: ['Quản lý thời gian', 'Kiên trì', 'Lãnh đạo']
  },
  { 
    id: 15, 
    name: 'Hợp tác', 
    level: 'Level 5.0', 
    description: 'Làm việc hiệu quả cùng những người khác để đạt mục tiêu chung', 
    image: '/skills/collaboration.jpg',
    category: 'Kỹ năng cộng tác',
    benefits: [
      'Tận dụng điểm mạnh của mỗi người',
      'Hoàn thành dự án lớn hiệu quả',
      'Học hỏi từ đồng nghiệp',
      'Xây dựng mạng lưới quan hệ'
    ],
    howToImprove: [
      'Chủ động đóng góp trong nhóm',
      'Tôn trọng ý kiến của người khác',
      'Chia sẻ kiến thức và kỹ năng',
      'Giúp đỡ đồng nghiệp khi cần'
    ],
    relatedSkills: ['Làm việc nhóm', 'Giao tiếp', 'Đồng cảm']
  },
  { 
    id: 16, 
    name: 'Đàm phán', 
    level: 'Level 5.0', 
    description: 'Tìm được giải pháp đôi bên cùng hài lòng trong mọi tình huống', 
    image: '/skills/negotiation.jpg',
    category: 'Kỹ năng chuyên môn',
    benefits: [
      'Đạt được thỏa thuận có lợi',
      'Duy trì mối quan hệ tốt đẹp',
      'Giải quyết xung đột win-win',
      'Nâng cao giá trị bản thân'
    ],
    howToImprove: [
      'Nghiên cứu kỹ trước khi đàm phán',
      'Lắng nghe nhu cầu của đối phương',
      'Tìm điểm chung và lợi ích chung',
      'Thực hành đàm phán trong cuộc sống'
    ],
    relatedSkills: ['Giao tiếp', 'Nghe lắng', 'Tư duy phê phán']
  },
  { 
    id: 17, 
    name: 'Tổ chức sự kiện', 
    level: 'Level 5.0', 
    description: 'Lên kế hoạch và triển khai sự kiện thành công một cách chuyên nghiệp', 
    image: '/skills/event-organization.jpg',
    category: 'Kỹ năng chuyên môn',
    benefits: [
      'Quản lý dự án hiệu quả',
      'Phát triển kỹ năng đa nhiệm',
      'Xây dựng mạng lưới quan hệ',
      'Tạo ấn tượng chuyên nghiệp'
    ],
    howToImprove: [
      'Tham gia tổ chức sự kiện nhỏ',
      'Học cách lập kế hoạch chi tiết',
      'Quản lý ngân sách và nguồn lực',
      'Dự phòng các tình huống phát sinh'
    ],
    relatedSkills: ['Quản lý thời gian', 'Làm việc nhóm', 'Trí tùy hứng']
  },
  { 
    id: 18, 
    name: 'Trí tùy hứng', 
    level: 'Level 5.0', 
    description: 'Xử lý tình huống bất ngờ một cách khéo léo và linh hoạt', 
    image: '/skills/improvisation.jpg',
    category: 'Kỹ năng phát triển',
    benefits: [
      'Phản ứng nhanh với thay đổi',
      'Tạo ấn tượng trong giao tiếp',
      'Giải quyết vấn đề sáng tạo',
      'Tự tin trong mọi tình huống'
    ],
    howToImprove: [
      'Tham gia các hoạt động improv',
      'Thực hành nói chuyện tự phát',
      'Đặt bản thân vào tình huống mới',
      'Học cách bình tĩnh khi bất ngờ'
    ],
    relatedSkills: ['Thích ứng', 'Sáng tạo', 'Tự tin']
  },
  { 
    id: 19, 
    name: 'Phát triển bản thân', 
    level: 'Level 5.0', 
    description: 'Liên tục học hỏi và cải thiện kỹ năng của bản thân', 
    image: '/skills/self-development.jpg',
    category: 'Kỹ năng cá nhân',
    benefits: [
      'Nâng cao giá trị bản thân',
      'Cập nhật xu hướng mới',
      'Tăng cơ hội nghề nghiệp',
      'Đạt được mục tiêu cuộc sống'
    ],
    howToImprove: [
      'Đọc sách và học liên tục',
      'Đặt mục tiêu phát triển cụ thể',
      'Tìm mentor và người hướng dẫn',
      'Nhận feedback và cải thiện'
    ],
    relatedSkills: ['Kiên trì', 'Thích ứng', 'Trách nhiệm']
  },
  { 
    id: 20, 
    name: 'Networking', 
    level: 'Level 5.0', 
    description: 'Xây dựng và duy trì mối quan hệ chuyên nghiệp hiệu quả', 
    image: '/skills/networking.jpg',
    category: 'Kỹ năng xã hội',
    benefits: [
      'Mở rộng cơ hội nghề nghiệp',
      'Học hỏi từ người trong ngành',
      'Tìm kiếm đối tác và khách hàng',
      'Xây dựng thương hiệu cá nhân'
    ],
    howToImprove: [
      'Tham gia sự kiện ngành nghề',
      'Chủ động giới thiệu bản thân',
      'Duy trì liên lạc với contacts',
      'Cung cấp giá trị cho người khác'
    ],
    relatedSkills: ['Giao tiếp', 'Đồng cảm', 'Tự tin']
  }
];

export function SkillsFlashcards() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const openSkillDetail = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsDialogOpen(true);
  };

  return (
    <section className="w-full py-16 sm:py-24 bg-gradient-to-b from-muted/50 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            20 Kỹ Năng Mềm Cần Phát Triển
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Khám phá những kỹ năng thiết yếu giúp bạn phát triển sự nghiệp và thành công trong cuộc sống. Nhấn vào từng kỹ năng để xem chi tiết.
          </p>
        </div>

        <div className="relative">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background hover:bg-muted rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 border border-border"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background hover:bg-muted rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 border border-border"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={checkScrollability}
            className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory hide-scrollbar px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {skills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => openSkillDetail(skill)}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-muted to-muted/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer flex-shrink-0 w-72 snap-center border border-border"
              >
                <div className="p-6 flex flex-col items-center text-center h-full">
                  {/* Image Container */}
                  <div className="relative w-32 h-32 mb-6 flex-shrink-0">
                    <div className="absolute inset-0 bg-background rounded-2xl" />
                    <Image
                      src={skill.image || "/placeholder.svg"}
                      alt={skill.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>

                  {/* Category Badge */}
                  <Badge variant="secondary" className="mb-3 text-xs">
                    {skill.category}
                  </Badge>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {skill.name}
                  </h3>

                  {/* Level */}
                  <div className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-1">
                    <span>{skill.level}</span>
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow line-clamp-3">
                    {skill.description}
                  </p>

                  {/* Click hint */}
                  <p className="text-xs text-primary mt-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Nhấn để xem chi tiết →
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>

          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>

      {/* Skill Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSkill && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-20 h-20 bg-muted rounded-xl flex-shrink-0">
                    <Image
                      src={selectedSkill.image || "/placeholder.svg"}
                      alt={selectedSkill.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {selectedSkill.category}
                    </Badge>
                    <DialogTitle className="text-2xl">{selectedSkill.name}</DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-base">
                  {selectedSkill.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Cấp độ</span>
                    <span className="text-sm text-muted-foreground">{selectedSkill.level}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lợi ích khi có kỹ năng này
                  </h4>
                  <ul className="space-y-2">
                    {selectedSkill.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* How to Improve */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Cách cải thiện kỹ năng
                  </h4>
                  <ul className="space-y-2">
                    {selectedSkill.howToImprove.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary font-bold">{index + 1}.</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Related Skills */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Kỹ năng liên quan
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.relatedSkills.map((relSkill, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer hover:bg-muted">
                        {relSkill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}