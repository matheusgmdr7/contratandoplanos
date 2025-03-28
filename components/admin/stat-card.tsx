import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "info"
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  color = "primary",
}: StatCardProps) {
  const colorClasses = {
    primary: "bg-[#168979]/10 text-[#168979]",
    secondary: "bg-purple-100 text-purple-600",
    success: "bg-green-100 text-green-600",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-red-100 text-red-600",
    info: "bg-blue-100 text-blue-600",
  }

  const trendClasses = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  }

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}

          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${trendClasses[trend]}`}>
              <span>{trendIcons[trend]}</span>
              <span className="ml-1">{trendValue}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  )
}

// Não é necessário alterar o código, apenas explicar de onde vem o valor

// O valor exibido no h3 vem da prop "value" que é passada para este componente
// quando ele é usado em outros arquivos, como no dashboard administrativo.
//
// Por exemplo, em app/admin/(auth)/page.tsx, o componente é usado assim:
//
// <StatCard
//   title="Total de Clientes"
//   value="1,248"
//   icon={Users}
//   trend="up"
//   trendValue="12% este mês"
//   color="primary"
// />
//
// Neste caso, o valor "1,248" é passado como prop e exibido no h3.

