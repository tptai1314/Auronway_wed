'use client';

import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useState } from 'react';

export function CtaSection() {
  const [email, setEmail] = useState('');

  return (
    <section className="w-full py-16 sm:py-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4 sm:text-5xl text-balance">
          Bắt đầu tích lũy kỹ năng từ hôm nay
        </h2>
        <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Gia nhập cộng đồng sinh viên thế hệ mới, biến mọi trải nghiệm thành bước để kỹ năng cá nhân nề cho sự nghiệp.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <div className="flex-1 sm:flex-initial">
            <input
              type="email"
              placeholder="Nhập email sinh viên"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-3 rounded-lg bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground"
            />
          </div>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
            <Mail className="mr-2 h-4 w-4" />
            Đăng ký bằng email
          </Button>
        </div>
        <p className="text-sm text-primary-foreground/80">Miễn phí từ đó cho sinh viên có email .edu</p>
        
        <div className="mt-8 pt-8 border-t border-primary-foreground/20">
          <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
            Liên hệ hợp tác
          </Button>
        </div>
      </div>
    </section>
  );
}
