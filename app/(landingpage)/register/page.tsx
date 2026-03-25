'use client';

import { useState } from 'react';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, Mail, Lock, User, GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [school, setSchool] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');

  const handleNextStep = () => {
    if (step === 1) {
      if (!name || !email) {
        setError('Vui lòng nhập đầy đủ thông tin');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      setIsLoading(false);
      return;
    }

    // Simulate registration
    setTimeout(() => {
      setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <main className="w-full overflow-hidden bg-background min-h-screen">
      <Header />
      
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Info */}
          <div className="hidden md:block">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Tham gia cùng SoftSkill
            </h1>
            <p className="text-muted-foreground mb-8">
              Tạo tài khoản miễn phí để bắt đầu hành trình phát triển kỹ năng mềm của bạn.
            </p>

            <div className="space-y-6">
              {[
                { icon: '✅', title: 'Miễn phí hoàn toàn', desc: 'Đăng ký và sử dụng nền tảng không mất phí' },
                { icon: '📊', title: 'Theo dõi tiến trình', desc: 'Xem báo cáo chi tiết về kỹ năng của bạn' },
                { icon: '📜', title: 'Chứng nhận kỹ năng', desc: 'Nhận chứng nhận cho mỗi kỹ năng đạt được' },
                { icon: '🌐', title: 'Kết nối cơ hội', desc: 'Tiếp cận cơ hội việc làm từ doanh nghiệp' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Form */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
                  S
                </div>
              </div>
              <CardTitle className="text-2xl">Tạo tài khoản mới</CardTitle>
              <CardDescription>
                Bước {step} / 2 - {step === 1 ? 'Thông tin cá nhân' : 'Bảo mật & Học vấn'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mb-4 border-green-500 text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-400">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {step === 1 ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Nguyễn Văn A"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Chúng tôi sẽ gửi email xác thực đến địa chỉ này
                      </p>
                    </div>

                    <Button type="button" className="w-full" onClick={handleNextStep}>
                      Tiếp tục
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="school">Trường / Đơn vị *</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="school"
                          type="text"
                          placeholder="Đại học ABC"
                          value={school}
                          onChange={(e) => setSchool(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="major">Ngành học</Label>
                        <Input
                          id="major"
                          type="text"
                          placeholder="Công nghệ thông tin"
                          value={major}
                          onChange={(e) => setMajor(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Năm học</Label>
                        <select
                          id="year"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="">Chọn năm</option>
                          <option value="1">Năm 1</option>
                          <option value="2">Năm 2</option>
                          <option value="3">Năm 3</option>
                          <option value="4">Năm 4</option>
                          <option value="graduate">Đã tốt nghiệp</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Mật khẩu *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tối thiểu 8 ký tự
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Xác nhận mật khẩu *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <input type="checkbox" id="terms" className="rounded border-border mt-1" required />
                      <label htmlFor="terms" className="text-sm text-muted-foreground">
                        Tôi đồng ý với{' '}
                        <Link href="/landingpage/terms" className="text-primary hover:underline">
                          Điều khoản dịch vụ
                        </Link>{' '}
                        và{' '}
                        <Link href="/landingpage/privacy" className="text-primary hover:underline">
                          Chính sách bảo mật
                        </Link>
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="flex-1" onClick={handlePrevStep}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tạo...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Tạo tài khoản
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}

                <div className="text-center text-sm text-muted-foreground">
                  Đã có tài khoản?{' '}
                  <Link href="/landingpage/auth" className="text-primary hover:underline font-medium">
                    Đăng nhập
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  );
}
