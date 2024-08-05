import { CircleUserRound } from 'lucide-react'
import React from 'react'

function DashboardHeader() {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between'>
      <div>
        Workspace-Loop
      </div>
      <div>
        <CircleUserRound />
      </div>
    </div>
  )
}

export default DashboardHeader
