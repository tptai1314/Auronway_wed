import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <main className="w-full overflow-hidden bg-background min-h-screen">
      <Header />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">Chính Sách Bảo Mật</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-8">
            Cập nhật lần cuối: 31 tháng 1, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Giới Thiệu</h2>
            <p className="text-muted-foreground mb-4">
              SoftSkill Platform (&ldquo;chúng tôi&rdquo;, &ldquo;của chúng tôi&rdquo;) cam kết bảo vệ quyền riêng tư của bạn. 
              Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ 
              thông tin cá nhân của bạn khi sử dụng nền tảng của chúng tôi.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Thông Tin Chúng Tôi Thu Thập</h2>
            <div className="text-muted-foreground space-y-4">
              <h3 className="text-lg font-medium text-foreground">2.1 Thông tin bạn cung cấp:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Họ và tên, email, số điện thoại</li>
                <li>Thông tin trường học, ngành học, năm học</li>
                <li>Ảnh đại diện và thông tin hồ sơ</li>
                <li>Lịch sử tham gia hoạt động và sự kiện</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-6">2.2 Thông tin tự động thu thập:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Địa chỉ IP và thông tin thiết bị</li>
                <li>Dữ liệu sử dụng và tương tác với nền tảng</li>
                <li>Cookies và công nghệ theo dõi tương tự</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cách Chúng Tôi Sử Dụng Thông Tin</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Cung cấp và cải thiện dịch vụ của chúng tôi</li>
              <li>Xác minh danh tính và quản lý tài khoản</li>
              <li>Gửi thông báo về hoạt động, sự kiện và cập nhật</li>
              <li>Phân tích và cải thiện trải nghiệm người dùng</li>
              <li>Tạo báo cáo kỹ năng và chứng nhận</li>
              <li>Liên hệ hỗ trợ khách hàng</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Chia Sẻ Thông Tin</h2>
            <p className="text-muted-foreground mb-4">
              Chúng tôi không bán thông tin cá nhân của bạn. Tuy nhiên, chúng tôi có thể chia sẻ thông tin với:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Trường đại học của bạn:</strong> Để xác minh và cập nhật điểm rèn luyện</li>
              <li><strong>Đơn vị tổ chức sự kiện:</strong> Khi bạn đăng ký tham gia sự kiện</li>
              <li><strong>Nhà tuyển dụng:</strong> Khi bạn chủ động chia sẻ hồ sơ của mình</li>
              <li><strong>Nhà cung cấp dịch vụ:</strong> Để hỗ trợ vận hành nền tảng</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Bảo Mật Dữ Liệu</h2>
            <p className="text-muted-foreground mb-4">
              Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin của bạn:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Mã hóa dữ liệu khi truyền tải (SSL/TLS)</li>
              <li>Mã hóa mật khẩu và thông tin nhạy cảm</li>
              <li>Kiểm soát truy cập nghiêm ngặt</li>
              <li>Sao lưu dữ liệu định kỳ</li>
              <li>Giám sát và phát hiện xâm nhập</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Quyền Của Bạn</h2>
            <p className="text-muted-foreground mb-4">Bạn có các quyền sau đây:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Quyền truy cập:</strong> Yêu cầu bản sao thông tin cá nhân của bạn</li>
              <li><strong>Quyền chỉnh sửa:</strong> Cập nhật thông tin không chính xác</li>
              <li><strong>Quyền xóa:</strong> Yêu cầu xóa tài khoản và dữ liệu</li>
              <li><strong>Quyền phản đối:</strong> Từ chối một số hình thức xử lý dữ liệu</li>
              <li><strong>Quyền di chuyển:</strong> Nhận dữ liệu ở định dạng có thể đọc được</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Chúng tôi sử dụng cookies để cải thiện trải nghiệm của bạn. Bạn có thể quản lý tùy chọn 
              cookies trong cài đặt trình duyệt. Các loại cookies chúng tôi sử dụng:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Cookies cần thiết:</strong> Để nền tảng hoạt động đúng</li>
              <li><strong>Cookies phân tích:</strong> Để hiểu cách người dùng sử dụng nền tảng</li>
              <li><strong>Cookies chức năng:</strong> Để ghi nhớ tùy chọn của bạn</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Lưu Trữ Dữ Liệu</h2>
            <p className="text-muted-foreground">
              Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để cung cấp dịch vụ 
              và tuân thủ nghĩa vụ pháp lý. Khi bạn xóa tài khoản, chúng tôi sẽ xóa hoặc ẩn danh hóa 
              dữ liệu của bạn trong vòng 30 ngày, trừ khi pháp luật yêu cầu lưu giữ lâu hơn.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Thay Đổi Chính Sách</h2>
            <p className="text-muted-foreground">
              Chúng tôi có thể cập nhật chính sách này theo thời gian. Chúng tôi sẽ thông báo cho bạn 
              về các thay đổi quan trọng qua email hoặc thông báo trên nền tảng.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Liên Hệ</h2>
            <p className="text-muted-foreground mb-4">
              Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:
            </p>
            <div className="bg-muted/50 rounded-lg p-6 text-muted-foreground">
              <p><strong>SoftSkill Platform</strong></p>
              <p>Email: privacy@softskill.vn</p>
              <p>Địa chỉ: TP. Hồ Chí Minh, Việt Nam</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
