import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <main className="w-full overflow-hidden bg-background min-h-screen">
      <Header />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">Điều Khoản Dịch Vụ</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-8">
            Cập nhật lần cuối: 31 tháng 1, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Chấp Nhận Điều Khoản</h2>
            <p className="text-muted-foreground">
              Bằng việc truy cập và sử dụng SoftSkill Platform (&ldquo;Nền tảng&rdquo;), bạn đồng ý tuân thủ 
              và chịu ràng buộc bởi các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với bất kỳ 
              phần nào của điều khoản, bạn không được phép sử dụng Nền tảng.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Mô Tả Dịch Vụ</h2>
            <p className="text-muted-foreground mb-4">
              SoftSkill Platform cung cấp các dịch vụ sau:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Nền tảng tích lũy và quản lý kỹ năng mềm cho sinh viên</li>
              <li>Hệ thống check-in và ghi nhận tham gia hoạt động, sự kiện</li>
              <li>Công cụ tạo và xuất CV dựa trên kỹ năng tích lũy</li>
              <li>Kết nối sinh viên với cơ hội nghề nghiệp</li>
              <li>Báo cáo và phân tích kỹ năng cá nhân</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Đăng Ký Tài Khoản</h2>
            <div className="text-muted-foreground space-y-4">
              <p><strong>3.1</strong> Để sử dụng Nền tảng, bạn cần tạo tài khoản với thông tin chính xác và đầy đủ.</p>
              <p><strong>3.2</strong> Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động dưới tài khoản của bạn.</p>
              <p><strong>3.3</strong> Bạn phải thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép vào tài khoản.</p>
              <p><strong>3.4</strong> Bạn phải từ 16 tuổi trở lên để đăng ký tài khoản.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Quy Tắc Sử Dụng</h2>
            <p className="text-muted-foreground mb-4">Khi sử dụng Nền tảng, bạn đồng ý không:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Cung cấp thông tin sai lệch hoặc gian lận</li>
              <li>Gian lận trong việc check-in hoặc tích lũy điểm</li>
              <li>Sử dụng tài khoản của người khác mà không được phép</li>
              <li>Chia sẻ mã QR check-in cho người không tham gia</li>
              <li>Sử dụng Nền tảng cho mục đích bất hợp pháp</li>
              <li>Phá hoại, hack hoặc can thiệp vào hoạt động của Nền tảng</li>
              <li>Thu thập thông tin của người dùng khác mà không được phép</li>
              <li>Spam hoặc gửi nội dung quảng cáo không được phép</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Quyền Sở Hữu Trí Tuệ</h2>
            <div className="text-muted-foreground space-y-4">
              <p><strong>5.1</strong> Nền tảng, bao gồm logo, thiết kế, nội dung và mã nguồn, thuộc sở hữu của SoftSkill Platform.</p>
              <p><strong>5.2</strong> Bạn được cấp quyền sử dụng cá nhân, không độc quyền để truy cập và sử dụng Nền tảng.</p>
              <p><strong>5.3</strong> Bạn không được sao chép, sửa đổi, phân phối hoặc bán bất kỳ phần nào của Nền tảng.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Nội Dung Người Dùng</h2>
            <div className="text-muted-foreground space-y-4">
              <p><strong>6.1</strong> Bạn giữ quyền sở hữu nội dung bạn tạo trên Nền tảng.</p>
              <p><strong>6.2</strong> Bạn cấp cho chúng tôi quyền sử dụng nội dung của bạn để vận hành và cải thiện dịch vụ.</p>
              <p><strong>6.3</strong> Bạn chịu trách nhiệm về tính chính xác và hợp pháp của nội dung bạn đăng tải.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Tích Lũy Kỹ Năng và Điểm</h2>
            <div className="text-muted-foreground space-y-4">
              <p><strong>7.1</strong> Điểm kỹ năng được tích lũy dựa trên việc tham gia thực tế vào các hoạt động và sự kiện.</p>
              <p><strong>7.2</strong> Chúng tôi có quyền điều chỉnh hoặc thu hồi điểm nếu phát hiện gian lận.</p>
              <p><strong>7.3</strong> Điểm không có giá trị quy đổi thành tiền mặt.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Chấm Dứt</h2>
            <div className="text-muted-foreground space-y-4">
              <p><strong>8.1</strong> Bạn có thể xóa tài khoản bất kỳ lúc nào.</p>
              <p><strong>8.2</strong> Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn nếu vi phạm Điều khoản.</p>
              <p><strong>8.3</strong> Sau khi chấm dứt, bạn vẫn có thể yêu cầu xuất dữ liệu cá nhân theo quy định.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Giới Hạn Trách Nhiệm</h2>
            <div className="text-muted-foreground space-y-4">
              <p><strong>9.1</strong> Nền tảng được cung cấp &ldquo;nguyên trạng&rdquo; mà không có bảo đảm nào.</p>
              <p><strong>9.2</strong> Chúng tôi không chịu trách nhiệm về thiệt hại gián tiếp phát sinh từ việc sử dụng Nền tảng.</p>
              <p><strong>9.3</strong> Trách nhiệm tối đa của chúng tôi không vượt quá số tiền bạn đã thanh toán (nếu có).</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Thay Đổi Điều Khoản</h2>
            <p className="text-muted-foreground">
              Chúng tôi có thể cập nhật Điều khoản này theo thời gian. Chúng tôi sẽ thông báo về các 
              thay đổi quan trọng. Việc tiếp tục sử dụng Nền tảng sau khi thay đổi có hiệu lực đồng 
              nghĩa với việc bạn chấp nhận Điều khoản mới.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Luật Áp Dụng</h2>
            <p className="text-muted-foreground">
              Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp sẽ được giải quyết 
              tại tòa án có thẩm quyền tại TP. Hồ Chí Minh, Việt Nam.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Liên Hệ</h2>
            <p className="text-muted-foreground mb-4">
              Nếu bạn có câu hỏi về Điều khoản Dịch vụ này, vui lòng liên hệ:
            </p>
            <div className="bg-muted/50 rounded-lg p-6 text-muted-foreground">
              <p><strong>SoftSkill Platform</strong></p>
              <p>Email: legal@softskill.vn</p>
              <p>Địa chỉ: TP. Hồ Chí Minh, Việt Nam</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
