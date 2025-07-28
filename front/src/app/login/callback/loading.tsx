export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="p-8 mx-4 w-full max-w-md text-center bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <div className="mb-4 w-12 h-12 rounded-full border-b-2 border-indigo-600 animate-spin"></div>
          <p className="text-gray-700">로그인 페이지 로딩 중...</p>
        </div>
      </div>
    </div>
  );
}
