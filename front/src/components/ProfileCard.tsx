type Props = {
    name: string
    email: string
  }
  
  export default function ProfileCard({ name, email }: Props) {
    return (
      <div className="flex items-center gap-4">
        <img
          src="https://randomuser.me/api/portraits/women/32.jpg"
          alt="profile"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <div className="text-base font-semibold">{name}</div>
          <div className="text-sm text-gray-500">{email}</div>
        </div>
      </div>
    )
  }
  