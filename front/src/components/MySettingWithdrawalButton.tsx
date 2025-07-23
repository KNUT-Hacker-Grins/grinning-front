export default function MySettingWithdrawalButton() {
  const handleWithdrawal = () => {
    // TODO: 회원 탈퇴 로직
    console.log('회원 탈퇴');
  };

  return (
    <div className="text-center pt-4">
      <button onClick={handleWithdrawal} className="text-sm text-red-500 underline">
        회원 탈퇴
      </button>
    </div>
  );
}
