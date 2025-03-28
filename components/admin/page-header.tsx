import type React from "react"

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({ title, description, action, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      {(action || actions) && <div className="mt-4 md:mt-0">{action || actions}</div>}
    </div>
  )
}

export default PageHeader

