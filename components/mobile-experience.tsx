import { QrCode, CheckCircle } from 'lucide-react';

export function MobileExperience() {
  return (
    <section className="relative w-full bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4 text-balance">
            Trải nghiệm mượt mà trên Mobile
          </h2>
          <p className="text-muted-foreground">Quản lý các hoạt động của bạn mọi lúc, mọi nơi</p>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <div className="flex justify-center">
              <div className="w-40 h-80 bg-white rounded-3xl border-8 border-black p-3 shadow-lg">
                <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-50 rounded-2xl p-4 flex flex-col">
                  <div className="text-xs font-semibold text-center text-gray-600 mb-2">Activity List</div>
                  <div className="space-y-2 flex-1">
                    <div className="h-2 bg-gray-300 rounded w-3/4" />
                    <div className="h-2 bg-gray-300 rounded w-4/5" />
                    <div className="h-2 bg-gray-300 rounded w-2/3" />
                    <div className="h-2 bg-gray-300 rounded w-3/4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center -mx-2 md:mx-0">
              <div className="w-40 h-80 bg-primary rounded-3xl border-8 border-black p-3 shadow-2xl transform md:scale-110">
                <div className="w-full h-full bg-gradient-to-b from-primary to-blue-700 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <div className="text-xs font-semibold text-center text-white mb-2">QR Scanner</div>
                  <div className="w-24 h-24 border-2 border-dashed border-white rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="text-white" size={40} />
                  </div>
                  <div className="text-xs text-center text-white font-medium">Dùng quét mã...</div>
                  <div className="text-xs text-center text-white/80 text-[10px] mt-1">Đăng ký tham dự sự kiện</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-40 h-80 bg-white rounded-3xl border-8 border-black p-3 shadow-lg">
                <div className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <CheckCircle className="text-primary mb-3" size={32} />
                  <div className="text-xs font-semibold text-center text-gray-800">Hoàn thành khóa học</div>
                  <div className="text-xs text-center text-gray-600 mt-2 text-[10px]">Leadership</div>
                  <div className="mt-6 w-full h-12 border-2 border-gray-300 rounded flex items-center justify-center">
                    <QrCode className="text-gray-400" size={20} />
                  </div>
                  <div className="text-xs text-center text-gray-500 mt-2">Digital Certificate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-4">
            <div className="inline-block px-4 py-2 bg-white rounded-full border border-border">
              1200+ sinh viên đang sử dụng • 35+ câu lạc bộ đã tham gia
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
