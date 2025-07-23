type Props = {
    title: string
  }
  
  export default function SectionTitle({ title }: Props) {
    return <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
  }
  